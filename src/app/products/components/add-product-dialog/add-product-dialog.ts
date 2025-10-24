import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.html',
  styleUrls: ['./add-product-dialog.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    NgIf,
    MatSelectModule,
    MatOptionModule
  ]
})
export class AddProductDialogComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File | null = null;
  previewSrc: string | ArrayBuffer | null = null;
  titleModal: string = 'Agregar Producto';
  errorMessage: string = '';

  constructor(
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private fb: FormBuilder,
    private productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: { product?: any }
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      value: ['', Validators.required],
      description: ['', Validators.required],
      productImage: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.product) {
      this.titleModal = 'Editar Producto';
      const product = this.data.product;
      this.productForm.patchValue({
        name: product.name,
        category: product.category,
        price: product.price,
        value: product.value,
        description: product.description,
        stock: product.stock,
        productImage: product.productImageUrl || ''
      });
      this.previewSrc = product.productImageUrl || null;
    } else {
      this.titleModal = 'Agregar Producto';
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const value = this.productForm.value;
      const form = new FormData();
      form.append('name', value.name);
      form.append('category', value.category);
      form.append('price', String(value.price));
      form.append('value', String(value.value));
      form.append('description', value.description);
      form.append('stock', String(value.stock));
      if (this.selectedFile) {
        form.append('productImage', this.selectedFile, this.selectedFile.name);
      }

      if (this.data && this.data.product && this.data.product._id) {
        // Edition mode
        this.productsService.updateProduct(this.data.product._id, form).subscribe({
          next: (result) => {
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.errorMessage = 'Ocurrió un error al editar el producto. Inténtalo nuevamente.';
          }
        });
      } else {
        // Creation mode
        this.productsService.createProduct(form).subscribe({
          next: (result) => {
            this.dialogRef.close(result);
          },
          error: (error) => {
            console.error('Error creating product:', error);
            this.errorMessage = 'Ocurrió un error al guardar el producto. Inténtalo nuevamente.';
          }
        });
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      this.previewSrc = null;
      this.productForm.patchValue({ productImage: '' });
      return;
    }

    const file = input.files[0];
    this.selectedFile = file;
    this.productForm.patchValue({ productImage: file.name });

    const reader = new FileReader();
    reader.onload = () => {
      this.previewSrc = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewSrc = null;
    this.productForm.patchValue({ productImage: '' });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}