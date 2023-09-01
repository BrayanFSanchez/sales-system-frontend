import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductService } from 'src/app/Services/product.service';
import { SaleService } from 'src/app/Services/sale.service';
import { UtilityService } from 'src/app/Reusable/utility.service';

import { Product } from 'src/app/Interfaces/product';
import { Sale } from 'src/app/Interfaces/sale';
import { SaleDetail } from 'src/app/Interfaces/sale-detail';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class SaleComponent implements OnInit {
  productList: Product[] = [];
  filterProductList: Product[] = [];

  listProductsForsale: SaleDetail[] = [];
  lockRegisterButton: boolean = false;

  selectedProduct!: Product;
  defaultPaymentType: string = 'Cash';
  totalToPay: number = 0;

  productSalesForm: FormGroup;
  columsTable: string[] = ['product', 'amount', 'price', 'total', 'action'];
  salesDetailData = new MatTableDataSource(this.listProductsForsale);

  returnProductsByFilter(search: any): Product[] {
    const searchValue =
      typeof search === 'string'
        ? search.toLocaleLowerCase()
        : search.name.toLocaleLowerCase();

    return this.productList.filter((item) =>
      item.name.toLocaleLowerCase().includes(searchValue)
    );
  }

  constructor(
    private fb: FormBuilder,
    private _productService: ProductService,
    private _saleService: SaleService,
    private _utilityService: UtilityService
  ) {
    this.productSalesForm = this.fb.group({
      product: ['', Validators.required],
      amount: ['', Validators.required],
    });

    this._productService.list().subscribe({
      next: (data) => {
        if (data.status) {
          const list = data.value as Product[];
          this.productList = list.filter((p) => p.isActive == 1 && p.stock > 0);
        }
      },
      error: (e) => {},
    });

    this.productSalesForm.get('product')?.valueChanges.subscribe((value) => {
      this.filterProductList = this.returnProductsByFilter(value);
    });
  }

  ngOnInit(): void {}

  showProduct(product: Product): string {
    return product.name;
  }

  productForSale(event: any) {
    this.selectedProduct = event.option.value;
  }

  addProductForSale() {
    const _amount: number = this.productSalesForm.value.amount;
    const _price: number = parseFloat(this.selectedProduct.price);
    const _total: number = _amount * _price;
    this.totalToPay = this.totalToPay + _total;

    this.listProductsForsale.push({
      idProduct: this.selectedProduct.idProduct,
      productDescription: this.selectedProduct.name,
      amount: _amount,
      priceText: String(_price.toFixed(2)),
      totalText: String(_total.toFixed(2)),
    });

    this.salesDetailData = new MatTableDataSource(this.listProductsForsale);

    this.productSalesForm.patchValue({
      product: '',
      amount: '',
    });
  }

  deleteProduct(detail: SaleDetail) {
    this.totalToPay = this.totalToPay - parseFloat(detail.totalText);
    this.listProductsForsale = this.listProductsForsale.filter(
      (p) => p.idProduct != detail.idProduct
    );

    this.salesDetailData = new MatTableDataSource(this.listProductsForsale);
  }

  registerSale() {
    if (this.listProductsForsale.length > 0) {
      this.lockRegisterButton = true;

      const request: Sale = {
        paymentType: this.defaultPaymentType,
        totalText: String(this.totalToPay.toFixed(2)),
        saleDetail: this.listProductsForsale,
      };

      this._saleService.register(request).subscribe({
        next: (response) => {
          if (response.status) {
            this.totalToPay = 0.0;
            (this.listProductsForsale = []),
              (this.salesDetailData = new MatTableDataSource(
                this.listProductsForsale
              ));

            Swal.fire({
              icon: 'success',
              title: 'Registered sale!',
              text: `Sale number: ${response.value.documentNumber}`,
            });
          } else {
            this._utilityService.showAlert('Failed to register sale', 'Oops!');
          }
        },
        complete: () => {
          this.lockRegisterButton = false;
        },
        error: (e) => {},
      });
    }
  }
}
