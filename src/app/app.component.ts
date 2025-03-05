import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './shared/material.module';
import { LayoutModule } from './shared/layout/layout.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutModule, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ng-users-crud';
  showFiller = signal<Boolean>(false);

  toggleFiller() {
    this.showFiller.set(!this.showFiller());
  }
}
