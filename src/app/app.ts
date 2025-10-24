import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/layout/header/header';
import { Footer } from './components/layout/footer/footer';
import { ListProducts } from './products/components/list-products/list-products';
import { Banner } from "./components/banner/banner";
import { Taps } from './components/taps/taps';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, ListProducts, Banner, Taps],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('clothing-store-frontend');
}
