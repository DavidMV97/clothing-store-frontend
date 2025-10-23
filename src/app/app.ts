import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { Footer } from './components/layout/footer/footer';
import { ListProducts } from './products/components/list-products/list-products';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, ListProducts],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('clothing-store-frontend');
}
