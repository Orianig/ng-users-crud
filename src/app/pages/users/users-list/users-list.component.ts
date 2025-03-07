import { Component, computed, inject, viewChild } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { MaterialModule } from '../../../shared/material.module';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell,
  MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../../../core/models/user.model';
import { UsersService } from '../../../core/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';
import { AlertService, MessageSeverity } from '../../../core/services/alert.service';

@Component({
  selector: 'app-users-list',
  imports: [MaterialModule, PageHeaderComponent, MatTable, MatSort, MatColumnDef,
    MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell,
    MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  private usersService = inject(UsersService);
  private alertService = inject(AlertService);
  dialog = inject(MatDialog);

  displayedColumns = ['avatar', 'first_name', 'last_name', 'email'];
  dataSource: MatTableDataSource<User>;
  sourceUser: User | null = null;
  loadingIndicator = false;

  //NOTE - Simulate permission for manage users
  canManageUsers = computed(() => 1 == 1);

  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);

  constructor() {
    if (this.canManageUsers()) {
      this.displayedColumns.push('actions');
    }
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.usersService.getUsers().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator();
          this.dataSource.sort = this.sort();
        });
      },
      error: (error) => {
        this.alertService.showMessage('Error', 'Error cargando los usuarios', MessageSeverity.error);
      },
      complete: () => {
        this.loadingIndicator = false;
        this.alertService.stopLoadingMessage();
      }
    });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }

  private refresh() {
    this.applyFilter(this.dataSource.filter);
  }

  editUser(user?: User) {
    this.sourceUser = user ?? null;
    const dialogRef = this.dialog.open(UserEditDialogComponent,
      {
        panelClass: 'mat-dialog-sm',
        data: { user }
      });
    dialogRef.afterClosed().subscribe(user => {
      if (user) {
        this.updateUser(user);
      }
    });
  }

  updateUser(user: User) {
    if (this.sourceUser) {
      Object.assign(this.sourceUser, user);
      this.alertService.showMessage('Éxito', `Cambios en el usuario "${user.first_name} ${user.last_name}" fueron guardados satisfactoriamente`, MessageSeverity.success);
      this.sourceUser = null;
    } else {
      this.dataSource.data.push(user);
      this.refresh();
      this.alertService.showMessage('Éxito', `Usuario "${user.first_name} ${user.last_name}" fue creado satisfactoriamente`, MessageSeverity.success);
    }
  }

  confirmDelete(user: User) {
    console.log(user);
  }
}
