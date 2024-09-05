import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataService } from './services/data.service';
import { CommonModule } from '@angular/common';
import { Money } from './types/money';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    HeaderComponent
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
        .reduce(
          (acc, rate) => {
            acc[rate.CurrencyCodeL] = Math.round(rate.Amount * 10) / 10;
            return acc;
          },
          { UAH: 1 } as Money
        );
    });
  }

  get currencyKeys(): string[] {
    return Object.keys(this.currencies);
  }

  handleCurrencyChange(type: 'from' | 'to', value: string) {
    if (type === 'from') {
      this.fromCurrency = value;
      this.convertCurrency('toFrom');
    } else {
      this.toCurrency = value;
      this.convertCurrency('fromTo');
    }
  }

  normalizeInput(value: string): string {
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    return cleanedValue.split('.').length > 2
      ? cleanedValue.slice(
          0,
          cleanedValue.indexOf('.', cleanedValue.indexOf('.') + 1)
        )
      : cleanedValue;
  }

  handleValueInput(type: 'from' | 'to', event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      const normalizedValue = this.normalizeInput(input.value);
      const value = normalizedValue === '' ? null : parseFloat(normalizedValue);

      if (type === 'from') {
        this.fromValue = value;
        this.convertCurrency('fromTo');
      } else {
        this.toValue = value;
        this.convertCurrency('toFrom');
      }

      input.value = normalizedValue;
    }
  }

  convertCurrency(direction: 'fromTo' | 'toFrom') {
    if (this.fromCurrency && this.toCurrency) {
      const fromCurrencyPrice = this.currencies[this.fromCurrency];
      const toCurrencyPrice = this.currencies[this.toCurrency];

      if (fromCurrencyPrice && toCurrencyPrice) {
        if (direction === 'fromTo' && this.fromValue !== null) {
          const exchangeRate = fromCurrencyPrice / toCurrencyPrice;
          this.toValue = Math.floor(this.fromValue * exchangeRate * 100) / 100;
        } else if (direction === 'toFrom' && this.toValue !== null) {
          const exchangeRate = toCurrencyPrice / fromCurrencyPrice;
          this.fromValue = Math.floor(this.toValue * exchangeRate * 100) / 100;
        } else {
          this.resetValues();
        }
      } else {
        this.resetValues();
      }
    } else {
      this.resetValues();
    }
  }

  resetValues() {
    this.fromValue = null;
    this.toValue = null;
  }

  handleReset() {
    this.resetValues();
    this.fromCurrency = null;
    this.toCurrency = null;
  }
}
