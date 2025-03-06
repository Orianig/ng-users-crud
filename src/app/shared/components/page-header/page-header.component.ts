import { Component, input } from '@angular/core';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.scss',
    imports: [MaterialModule]
})
export class PageHeaderComponent {
  readonly title = input<string>();
  readonly icon = input<string>();
}
