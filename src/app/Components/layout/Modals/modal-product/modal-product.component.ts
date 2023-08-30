import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Category } from 'src/app/Interfaces/category';
import { Product } from 'src/app/Interfaces/product';
import { CategoryService } from 'src/app/Services/category.service';
import { ProductService } from 'src/app/Services/product.service';
import { UtilityService } from 'src/app/Reusable/utility.service';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.css'],
})
export class ModalProductComponent implements OnInit {
  productForm: FormGroup;
  titleAction: string = 'Agregar';
  actionButton: string = 'Guardar';
  categoryList: Category[] = [];

  constructor(
    private currentModal: MatDialogRef<ModalProductComponent>,
    @Inject(MAT_DIALOG_DATA) public productData: Product,
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _utilityService: UtilityService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      idCategorie: ['', Validators.required],
      stock: ['', Validators.required],
      price: ['', Validators.required],
      isActive: ['1', Validators.required],
    });

    if (this.productData != null) {
      this.titleAction = 'Edit';
      this.actionButton = 'Actualizar';
    }

    this._categoryService.list().subscribe({
      next: (data) => {
        if (data.status) this.categoryList = data.value;
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    if (this.productData !== null) {
      this.productForm.patchValue({
        name: this.productData.name,
        idCategorie: this.productData.idCategorie,
        stock: this.productData.stock,
        price: this.productData.price,
        isActive: this.productData.isActive.toString(),
      });
    }
  }

  saveEditProduct() {
    const _product: Product = {
      idProduct: this.productData == null ? 0 : this.productData.idProduct,
      name: this.productForm.value.name,
      idCategorie: this.productForm.value.idCategorie,
      categoryDescription: '',
      price: this.productForm.value.price,
      stock: this.productForm.value.stock,
      isActive: parseInt(this.productForm.value.isActive),
    };

    if (this.productData == null) {
      this._productService.save(_product).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert(
              'The product was registered',
              'Success'
            );
            this.currentModal.close('true');
          } else {
            this._utilityService.showAlert(
              'Failed to register product',
              'Error'
            );
          }
        },
        error: (e) => {},
      });
    } else {
      this._productService.edit(_product).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilityService.showAlert('The product was edited', 'Success');
            this.currentModal.close('true');
          } else {
            this._utilityService.showAlert('Failed to edit product', 'Error');
          }
        },
        error: (e) => {},
      });
    }
  }
}
