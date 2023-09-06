import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import * as XLSX from 'xlsx';

import { Report } from 'src/app/Interfaces/report';
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
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }],
})
export class ReportComponent implements OnInit {
  filterForm: FormGroup;
  salesListReport: Report[] = [];
  columsTable: string[] = [
    'registrationDate',
    'saleNumber',
    'paymentType',
    'total',
    'product',
    'amount',
    'price',
    'totalProduct',
  ];
  dataSaleReport = new MatTableDataSource(this.salesListReport);
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _saleService: SaleService,
    private _utilityService: UtilityService
  ) {
    this.filterForm = this.fb.group({
      startDate: ['', Validators.required],
      finishDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSaleReport.paginator = this.paginationTable;
  }

  searchSales() {
    const _startDate = moment(this.filterForm.value.startDate).format(
      'DD/MM/YYYY'
    );

    const _finishDate = moment(this.filterForm.value._finishDate).format(
      'DD/MM/YYYY'
    );

    if (_startDate === 'invalid date' || _finishDate === 'invalid date') {
      this._utilityService.showAlert('You must enter multiple dates', 'Oops!');
      return;
    }

    this._saleService.report(_startDate, _finishDate).subscribe({
      next: (data) => {
        if (data.status) {
          this.salesListReport = data.value;
          this.dataSaleReport.data = data.value;
        } else {
          this.salesListReport = [];
          this.dataSaleReport.data = [];
          this._utilityService.showAlert('No data found', 'Oops!');
        }
      },
      error: (e) => {},
    });
  }

  exportExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.salesListReport);

    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'sales_report.xlsx');
  }
}
