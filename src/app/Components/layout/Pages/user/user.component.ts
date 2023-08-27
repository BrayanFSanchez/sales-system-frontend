import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUserComponent } from '../../Modals/modal-user/modal-user.component';
import { User } from 'src/app/Interfaces/user';
import { UserService } from 'src/app/Services/user.service';
import { UtilityService } from 'src/app/Reusable/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, AfterViewInit {
  columsTable: string[] = [
    'fullName',
    'email',
    'roleDescription',
    'state',
    'actions',
  ];
  startData: User[] = [];
  dataUserList = new MatTableDataSource(this.startData);
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _userService: UserService,
    private _utilityService: UtilityService
  ) {}

  getUsers() {
    this._userService.list().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataUserList.data = data.value;
        } else {
          this._utilityService.showAlert('No data found', 'Oops!');
        }
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.dataUserList.paginator = this.paginationTable;
  }

  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataUserList.filter = filterValue.trim().toLocaleLowerCase();
  }

  newUser() {
    this.dialog
      .open(ModalUserComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') {
          this.getUsers();
        }
      });
  }

  editUser(user: User) {
    this.dialog
      .open(ModalUserComponent, {
        disableClose: true,
        data: user,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') {
          this.getUsers();
        }
      });
  }

  deleteUser(user: User) {
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      text: user.fullName,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No volver',
    }).then((result) => {
      if (result.isConfirmed) {
        this._userService.delete(user.idUser).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilityService.showAlert('The user was deleted', 'Ready!');
              this.getUsers();
            } else {
              this._utilityService.showAlert('Could not delete user', 'Error');
            }
          },
          error: (e) => {},
        });
      }
    });
  }
}
