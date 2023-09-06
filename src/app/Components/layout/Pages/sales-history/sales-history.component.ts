import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import { ModalSaleDetailComponent } from '../../Modals/modal-sale-detail/modal-sale-detail.component';

import { Sale } from 'src/app/Interfaces/sale';
import { SaleService } from 'src/app/Services/sale.service';
import { UtilityService } from 'src/app/Reusable/utility.service';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }],
})
export class SalesHistoryComponent implements OnInit, AfterViewInit {
  searchForm: FormGroup;
  searchOptions: any[] = [
    {
      value: 'date',
      description: 'By dates',
    },
    {
      value: 'number',
      description: 'Sale number',
    },
  ];
  columsTable: string[] = [
    'registrationDate',
    'documentNumber',
    'paymentType',
    'total',
    'action',
  ];
  startDate: Sale[] = [];
  salesListData = new MatTableDataSource(this.startDate);
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _saleService: SaleService,
    private _utilityService: UtilityService
  ) {
    this.searchForm = this.fb.group({
      toLookFor: ['date'],
      number: [''],
      startDate: [''],
      finishDate: [''],
    });

    this.searchForm.get('toLookFor')?.valueChanges.subscribe((value) => {
      this.searchForm.patchValue({
        number: '',
        startDate: '',
        finishDate: '',
      });
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.salesListData.paginator = this.paginationTable;
  }

  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.salesListData.filter = filterValue.trim().toLocaleLowerCase();
  }

  searchSales() {
    let _startDate: string = '';
    let _finishDate: string = '';

    if (this.searchForm.value.toLookFor === 'date') {
      _startDate = moment(this.searchForm.value.startDate).format('DD/MM/YYYY');

      _finishDate = moment(this.searchForm.value._finishDate).format(
        'DD/MM/YYYY'
      );

      if (_startDate === 'invalid date' || _finishDate === 'invalid date') {
        this._utilityService.showAlert(
          'You must enter multiple dates',
          'Oops!'
        );
        return;
      }
    }

    this._saleService
      .record(
        this.searchForm.value.toLookFor,
        this.searchForm.value.number,
        _startDate,
        _finishDate
      )
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.salesListData = data.value;
          } else {
            this._utilityService.showAlert('No data found', 'Oops!');
          }
        },
        error: (e) => {},
      });
  }

  seeSaleDetail(_sale: Sale) {
    this.dialog.open(ModalSaleDetailComponent, {
      data: _sale,
      disableClose: true,
      width: '700px',
    });
  }
}
