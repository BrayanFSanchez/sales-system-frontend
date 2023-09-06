import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sale } from 'src/app/Interfaces/sale';
import { SaleDetail } from 'src/app/Interfaces/sale-detail';

@Component({
  selector: 'app-modal-sale-detail',
  templateUrl: './modal-sale-detail.component.html',
  styleUrls: ['./modal-sale-detail.component.css'],
})
export class ModalSaleDetailComponent implements OnInit {
  registrationDate: string = '';
  documentNumber: string = '';
  paymentType: string = '';
  total: string = '';
  saleDetail: SaleDetail[] = [];
  columsTable: string[] = ['product', 'amount', 'price', 'total'];

  constructor(@Inject(MAT_DIALOG_DATA) public _saleData: Sale) {
    this.registrationDate = _saleData.registrationDate!;
    this.documentNumber = _saleData.documentNumber!;
    this.paymentType = _saleData.paymentType;
    this.total = _saleData.totalText;
    this.saleDetail = _saleData.saleDetail;
  }

  ngOnInit(): void {}
}
