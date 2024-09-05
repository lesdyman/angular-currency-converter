import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Currency } from '../types/currency';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = `https://bank.gov.ua/NBU_Exchange/exchange?json`;

  constructor(private http: HttpClient) {}

  getExchangeRates(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.url);
  }
}
