import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Menu } from 'src/app/Interfaces/menu';

import { MenuService } from 'src/app/Services/menu.service';
import { UtilityService } from 'src/app/Reusable/utility.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  menuList: Menu[] = [];
  userMail: string = '';
  userRole: string = '';

  constructor(
    private router: Router,
    private _menuService: MenuService,
    private _utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    const user = this._utilityService.getUserSession();

    if (user !== null) {
      this.userMail = user.email;
      this.userRole = user.roleDescription;

      this._menuService.list(user.idUser).subscribe({
        next: (data) => {
          if (data.status) {
            this.menuList = data.value;
          }
        },
        error: (e) => {},
      });
    }
  }

  logout() {
    this._utilityService.deleteUserSession();
    this.router.navigate(['login']);
  }
}
