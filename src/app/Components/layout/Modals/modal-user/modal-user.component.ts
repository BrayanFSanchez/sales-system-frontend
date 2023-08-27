import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/Interfaces/user';
import { Role } from 'src/app/Interfaces/role';

import { RoleService } from 'src/app/Services/role.service';
import { UserService } from 'src/app/Services/user.service';
import { UtilityService } from 'src/app/Reusable/utility.service';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css'],
})
export class ModalUserComponent implements OnInit {
  userForm: FormGroup;
  hidePassword: boolean = true;
  titleAction: string = 'Agregar';
  actionButton: string = 'Guardar';
  roleList: Role[] = [];

  constructor(
    private currentModal: MatDialogRef<ModalUserComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: User,
    private fb: FormBuilder,
    private _roleService: RoleService,
    private _userService: UserService,
    private _utilityService: UtilityService
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      idRole: ['', Validators.required],
      clue: ['', Validators.required],
      isActive: ['1', Validators.required],
    });

    if (this.userData != null) {
      this.titleAction = 'Edit';
      this.actionButton = 'Actualizar';
    }

    this._roleService.list().subscribe({
      next: (data) => {
        if (data.status) this.roleList = data.value;
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    if (this.userData !== null) {
      this.userForm.patchValue({
        fullName: this.userData.fullName,
        email: this.userData.email,
        idRole: this.userData.idRole,
        clue: this.userData.clue,
        isActive: this.userData.isActive.toString(),
      });
    }
  }

  saveEditUser() {
    const _user: User = {
      idUser: this.userData == null ? 0 : this.userData.idUser,
      fullName: this.userForm.value.fullName,
      email: this.userForm.value.email,
      idRole: this.userForm.value.idRole,
      roleDescription: '',
      clue: this.userForm.value.clue,
      isActive: parseInt(this.userForm.value.isActive),
    };

    if (this.userData == null) {
      this._userService.save(_user).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert(
              'The user was registered',
              'Success'
            );
            this.currentModal.close('true');
          } else {
            this._utilityService.showAlert('Failed to register user', 'Error');
          }
        },
        error: (e) => {},
      });
    } else {
      this._userService.edit(_user).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert('The user was edited', 'Success');
            this.currentModal.close('true');
          } else {
            this._utilityService.showAlert('Failed to edit user', 'Error');
          }
        },
        error: (e) => {},
      });
    }
  }
}
