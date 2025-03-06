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

  displayedColumns = ['jobTitle', 'userName', 'fullName', 'email'];
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

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }

  private refresh() {
    this.applyFilter(this.dataSource.filter);
  }

  editUser(user?: User) {
    console.log(user);
  }

  confirmDelete(user: User) {
    console.log(user);
  }
}
