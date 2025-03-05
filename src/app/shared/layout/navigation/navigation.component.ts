import { Component, OnInit, OnDestroy, inject, Renderer2, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-navigation',
  imports: [
    MaterialModule, RouterLink, RouterLinkActive,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {

  router = inject(Router);
  renderer = inject(Renderer2);

  isMenuCollapsed = true;
  isAppLoaded = false;
  isUserLoggedIn = true;
  newNotificationCount = signal<number>(0);

  logout() {
    this.isUserLoggedIn = false;
  }
}
