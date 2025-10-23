import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

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
    NgIf
  ]
})
export class AddProductDialogComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;
  previewSrc: string | ArrayBuffer | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private fb: FormBuilder,
    private productsService: ProductsService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      value: ['', Validators.required],
      description: ['', Validators.required],
      // productImage control will hold the filename for validation, actual file in selectedFile
      productImage: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFile) {
      const form = new FormData();
      const value = this.productForm.value;
      form.append('name', value.name);
      form.append('category', value.category);
      form.append('price', String(value.price));
      form.append('value', String(value.value));
      form.append('description', value.description);
      form.append('stock', String(value.stock));
      form.append('productImage', this.selectedFile, this.selectedFile.name);

      this.productsService.createProduct(form).subscribe({
        next: (result) => {
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
    } else {
      // mark controls as touched to show validation
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