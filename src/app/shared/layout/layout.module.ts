import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    NavigationComponent
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    NavigationComponent
  ]
})
export class LayoutModule { }
