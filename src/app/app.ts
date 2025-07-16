import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from './toolbar/toolbar';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toolbar, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Fromero-E01';
}
