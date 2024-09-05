import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @Input() currencies: string[] = [];
  @Input() selectedCurrency: string | null = null;
  @Input() value: number | null = null;
  @Input() placeholder: string = '';

  @Output() currencyChange = new EventEmitter<string>();
  @Output() valueInput = new EventEmitter<number | null>();

  onCurrencyChange(event: any) {
    this.currencyChange.emit(event.value);
  }

  onValueInput(event: any) {
    const normalizedValue = this.normalizeInput(event.target.value);
    this.valueInput.emit(normalizedValue === '' ? null : parseFloat(normalizedValue));
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
}
