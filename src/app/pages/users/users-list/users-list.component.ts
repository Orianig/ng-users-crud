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
  dialog = inject(MatDialog);

  displayedColumns = ['avatar', 'first_name', 'last_name', 'email'];
  dataSource: MatTableDataSource<User>;
  sourceUser: User | null = null;
  loadingIndicator = false;

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
    this.loadingIndicator = true;
    this.usersService.getUsers().subscribe(response => {
      this.dataSource.data = response.data;
      this.loadingIndicator = false;

      setTimeout(() => {
        this.dataSource.paginator = this.paginator();
        this.dataSource.sort = this.sort();
      });
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
      // this.alertService.showMessage('Success', `Changes to user "${user.userName}" was saved successfully`, MessageSeverity.success);
      this.sourceUser = null;
    } else {
      this.dataSource.data.push(user);
      this.refresh();
      // this.alertService.showMessage('Success', `User "${user.userName}" was created successfully`, MessageSeverity.success);
    }
  }

  confirmDelete(user: User) {
    console.log(user);
  }
}
