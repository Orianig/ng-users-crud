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
      // TODO - in this project are using dialog for edit, it is an example
      // {
      //     path: 'edit/:id',
      //     component: UsersEditComponent
      // }
  ]
}];
