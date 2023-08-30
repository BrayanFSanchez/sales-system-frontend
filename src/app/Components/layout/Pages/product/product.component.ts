import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductComponent } from '../../Modals/modal-product/modal-product.component';
import { Product } from 'src/app/Interfaces/product';
import { ProductService } from 'src/app/Services/product.service';
import { UtilityService } from 'src/app/Reusable/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, AfterViewInit {
  columsTable: string[] = [
    'name',
    'category',
    'stock',
    'price',
    'state',
    'actions',
  ];
  startData: Product[] = [];
  dataProductList = new MatTableDataSource(this.startData);
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _productService: ProductService,
    private _utilityService: UtilityService
  ) {}

  getProducts() {
    this._productService.list().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataProductList.data = data.value;
        } else {
          this._utilityService.showAlert('No data found', 'Oops!');
        }
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.dataProductList.paginator = this.paginationTable;
  }

  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataProductList.filter = filterValue.trim().toLocaleLowerCase();
  }

  newProduct() {
    this.dialog
      .open(ModalProductComponent, {
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') {
          this.getProducts();
        }
      });
  }

  editProduct(product: Product) {
    this.dialog
      .open(ModalProductComponent, {
        disableClose: true,
        data: product,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') {
          this.getProducts();
        }
      });
  }

  deleteProduct(product: Product) {
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      text: product.name,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No volver',
    }).then((result) => {
      if (result.isConfirmed) {
        this._productService.delete(product.idProduct).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilityService.showAlert(
                'The product was deleted',
                'Ready!'
              );
              this.getProducts();
            } else {
              this._utilityService.showAlert(
                'Could not delete product',
                'Error'
              );
            }
          },
          error: (e) => {},
        });
      }
    });
  }
}
