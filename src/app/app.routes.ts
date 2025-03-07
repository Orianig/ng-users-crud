import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./pages/users/users.routes')
        .then(m => m.USERS_ROUTES)
  },
  {
    path: 'about',
    loadComponent: () =>
        import('./pages/about/about.component')
            .then(m => m.AboutComponent)
  },
];
