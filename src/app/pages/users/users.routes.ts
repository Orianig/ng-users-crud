import { Routes } from "@angular/router";
import { UsersComponent } from "./users.component";
import { UsersListComponent } from "./users-list/users-list.component";
import { UsersEditComponent } from "./users-edit/users-edit.component";

export const USERS_ROUTES: Routes = [{
  path: '',
  component: UsersComponent,
  children: [
      {
          path: '',
          pathMatch: 'full',
          redirectTo: 'list'
      },
      {
          path: 'list',
          component: UsersListComponent
      },
      {
        path: 'edit',
        component: UsersEditComponent
      },
      {
          path: 'edit/:id',
          component: UsersEditComponent
      }
  ]
}];
