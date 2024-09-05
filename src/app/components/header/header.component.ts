import { Component, Input } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Money } from '../../types/money';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() currencies: Money = {};
}
