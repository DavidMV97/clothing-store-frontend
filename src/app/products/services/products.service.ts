import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";
import { Product, ProductsApiResponse } from "../interfaces/product.interface";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private http = inject(HttpClient);

  createProduct(product: FormData | Partial<Product>): Observable<Product> {
    // If product is FormData (file upload), let HttpClient send it as multipart/form-data automatically.
    return this.http.post<Product>(`${baseUrl}/products`, product as any);
  }

  updateProduct(id: string, product: FormData | Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${baseUrl}/products/${id}`, product as any);
  }


  getProducts(page: number = 1, category?: string, search?: string): Observable<ProductsApiResponse> {
    const params: any = { page: page.toString() };
    if (category) params.category = category;
    if (search) params.search = search;

    return this.http.get<ProductsApiResponse>(`${baseUrl}/products`, { params }).pipe(
      tap((response) => console.log('Products response:', response))
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/products/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${baseUrl}/categories`);
  }
}

