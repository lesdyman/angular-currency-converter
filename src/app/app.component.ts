import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { DataService } from './services/data.service';
import { CommonModule } from '@angular/common';
import { Money } from './types/money';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatCardModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatButtonModule,
    MatIcon,
    MatToolbar,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-currency-calculator';

  currencies: Money = {};
  requiredCurrencis = ['USD', 'EUR', 'GBP', 'PLN', 'CAD', 'CZK', 'CHF'];

  fromCurrency: string | null = null;
  toCurrency: string | null = null;
  fromValue: number | null = null;
  toValue: number | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies() {
    this.dataService.getExchangeRates().subscribe((data) => {
      this.currencies = data
        .filter((rate) => this.requiredCurrencis.includes(rate.CurrencyCodeL))
        .reduce((acc, rate) => {
          acc[rate.CurrencyCodeL] = Math.round(rate.Amount * 10) / 10;
          return acc;
        }, {} as Money);
    });
  }

  get currencyKeys(): string[] {
    return Object.keys(this.currencies);
  }

  handleFromCurrencyChange(value: string) {
    this.fromCurrency = value;
    this.convertFromToCurrency();
  }

  handleToCurrencyChange(value: string) {
    this.toCurrency = value;
    this.convertFromToCurrency();
  }

  handleFromValueInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      const cleanedValue = input.value.replace(/[^0-9.]/g, '');
      const normalizedValue = cleanedValue.split('.').length > 2
        ? cleanedValue.slice(0, cleanedValue.indexOf('.', cleanedValue.indexOf('.') + 1))
        : cleanedValue;

      this.fromValue = normalizedValue === '' ? null : parseFloat(normalizedValue);
      input.value = normalizedValue;

      this.convertFromToCurrency();
    }
  }

  handleToValueInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      const cleanedValue = input.value.replace(/[^0-9.]/g, '');
      const normalizedValue = cleanedValue.split('.').length > 2
        ? cleanedValue.slice(0, cleanedValue.indexOf('.', cleanedValue.indexOf('.') + 1))
        : cleanedValue;

      this.toValue = normalizedValue === '' ? null : parseFloat(normalizedValue);
      input.value = normalizedValue;

      this.convertToFromCurrency();
    }
  }

  convertFromToCurrency() {
    if (this.fromCurrency && this.toCurrency && this.fromValue !== null) {
      const fromCurrencyPrice = this.currencies[this.fromCurrency];
      const toCurrencyPrice = this.currencies[this.toCurrency];

      if (fromCurrencyPrice && toCurrencyPrice) {
        const exchangeRate = fromCurrencyPrice / toCurrencyPrice;
        this.toValue = Math.floor(this.fromValue * exchangeRate * 100) / 100;
      } else {
        this.toValue = null;
      }
    } else {
      this.toValue = null;
    }
  }

  convertToFromCurrency() {
    if (this.fromCurrency && this.toCurrency && this.toValue !== null) {
      const fromCurrencyPrice = this.currencies[this.fromCurrency];
      const toCurrencyPrice = this.currencies[this.toCurrency];

      if (fromCurrencyPrice && toCurrencyPrice) {
        const exchangeRate = toCurrencyPrice / fromCurrencyPrice;
        this.fromValue = Math.floor(this.toValue * exchangeRate * 100) / 100;
      } else {
        this.fromValue = null;
      }
    } else {
      this.fromValue = null;
    }
  }

  handleReset() {
    this.fromCurrency = null;
    this.toCurrency = null;
    this.fromValue = null;
    this.toValue = null;
  }
}
