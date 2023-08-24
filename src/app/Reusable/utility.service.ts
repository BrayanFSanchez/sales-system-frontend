import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Session } from '../Interfaces/session';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor(private _snackBar: MatSnackBar) {}

  showAlert(message: string, type: string) {
    this._snackBar.open(message, type, {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      duration: 3000,
    });
  }

  saveUserSession(userSession: Session) {
    localStorage.setItem('user', JSON.stringify(userSession));
  }

  getUserSession() {
    const dataString = localStorage.getItem('user');
    const user = JSON.parse(dataString!);
    return user;
  }

  deleteUserSession() {
    localStorage.removeItem('user');
  }
}
