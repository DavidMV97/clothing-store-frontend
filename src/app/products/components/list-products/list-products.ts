import { Component, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { AsyncPipe, CurrencyPipe, NgForOf, NgIf, DatePipe } from '@angular/common';
import { Product, ProductsApiResponse, Pagination } from '../../interfaces/product.interface';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgForOf, NgIf, DatePipe, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './list-products.html',
  styleUrl: './list-products.css',
})
export class ListProducts implements OnInit {
  private productService = inject(ProductsService);
  private dialog = inject(MatDialog);
  private currentPageSubject = new BehaviorSubject<number>(1);
  private snackBar = inject(MatSnackBar);


  expandedItems = new Set<string>();
  currentPage$ = this.currentPageSubject.asObservable();
  pagination: Pagination | null = null;

  products$ = this.currentPage$.pipe(
    switchMap(page => this.productService.getProducts(page).pipe(
      tap(response => this.pagination = response.pagination),
      map(response => response.products)
    ))
  );

  trackById(_index: number, item: Product) {
    return item?._id ?? item?.name;
  }

  toggleExpand(productId: string) {
    if (this.expandedItems.has(productId)) {
      this.expandedItems.delete(productId);
    } else {
      this.expandedItems.add(productId);
    }
  }

  isExpanded(productId: string): boolean {
    return this.expandedItems.has(productId);
  }

  ngOnInit(): void {
    // Initial load is handled by products$ stream
  }

  nextPage(): void {
    if (this.pagination && this.currentPageSubject.value < this.pagination.totalPages) {
      this.currentPageSubject.next(this.currentPageSubject.value + 1);
      this.expandedItems.clear();
    }
  }

  previousPage(): void {
    if (this.currentPageSubject.value > 1) {
      this.currentPageSubject.next(this.currentPageSubject.value - 1);
      this.expandedItems.clear();
    }
  }

  get canGoNext(): boolean {
    return this.pagination ? this.currentPageSubject.value < this.pagination.totalPages : false;
  }

  get canGoPrevious(): boolean {
    return this.currentPageSubject.value > 1;
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the current page to show the new product
        this.currentPageSubject.next(this.currentPageSubject.value);
      }
    });
  }

  openEditProductDialog(product: Product): void {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      data: { product }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the current page to show the updated product
        this.currentPageSubject.next(this.currentPageSubject.value);
      }
    });
  }


  openDeleteProductDialog(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { id: product._id!, name: product.name },
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.productService.deleteProduct(product._id!).subscribe({
          next: () => {
            this.snackBar.open('Producto eliminado con éxito', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            this.currentPageSubject.next(this.currentPageSubject.value);
          },
          error: err => {
            console.error('Error al eliminar producto:', err);
            this.snackBar.open('Error al eliminar el producto', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }



}