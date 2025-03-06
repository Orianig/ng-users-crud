import { Component, AfterViewInit, inject, viewChild, OnChanges } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { MaterialModule } from '../../../shared/material.module';

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
  private formBuilder = inject(FormBuilder);

  userForm = this.formBuilder.group({
    first_name: [this.data?.user?.first_name || '', Validators.required],
    last_name: [this.data?.user?.last_name || '', Validators.required],
    email: [this.data?.user?.email || '', [Validators.required, Validators.email]],
    avatar: [this.data?.user?.avatar || ''],
  });

  onSaveUser() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
