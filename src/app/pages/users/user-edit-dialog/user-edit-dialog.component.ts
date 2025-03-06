import { Component, AfterViewInit, inject, viewChild, OnChanges } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { MaterialModule } from '../../../shared/material.module';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: 'user-edit-dialog.component.html',
  styleUrl: 'user-edit-dialog.component.scss',
  imports: [
    FormsModule, ReactiveFormsModule,
    MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MaterialModule
  ]
})
export class UserEditDialogComponent {
  dialogRef = inject<MatDialogRef<UserEditDialogComponent>>(MatDialogRef);
  data = inject<{ user: User }>(MAT_DIALOG_DATA);
  private usersService = inject(UsersService);
  private formBuilder = inject(FormBuilder);

  isNewUser = !this.data?.user;
  userForm = this.formBuilder.group({
    first_name: [this.data?.user?.first_name || '', Validators.required],
    last_name: [this.data?.user?.last_name || '', Validators.required],
    email: [this.data?.user?.email || '', [Validators.required, Validators.email]],
    avatar: [this.data?.user?.avatar || ''],
  });

  onSaveUser() {
    if (this.userForm.invalid) return;
    const userData = this.getEditedUser();
    if (this.isNewUser) {
      this.usersService.createUser(userData).subscribe({
        next: (newUser) => this.dialogRef.close(newUser),
        error: (err) => console.error('Error al crear usuario', err)
      });
    } else {
      const userId = this.data?.user?.id;
      if (!userId) {
        console.error('No se puede actualizar: ID de usuario no encontrado');
        return;
      }
      this.usersService.updateUser(userId, userData).subscribe({
        next: (updatedUser) => this.dialogRef.close(updatedUser),
        error: (err) => console.error('Error al actualizar usuario', err)
      });
    }
  }

  private getEditedUser(): Partial<User> {
    const formModel = this.userForm.value;

    return {
      ...(this.data?.user?.id && {id: this.data.user.id}),
      first_name: formModel.first_name ?? '',
      last_name: formModel.last_name ?? '',
      email: formModel.email ?? '',
      avatar: formModel.avatar ?? ''
    };
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
