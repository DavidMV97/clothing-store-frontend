import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";
import { Product, ProductsApiResponse } from "../interfaces/product.interface";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";

const baseUrl =  environment.baseUrl;

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private http = inject(HttpClient);   
  
  createProduct(product: FormData | Partial<Product>): Observable<Product> {
    // If product is FormData (file upload), let HttpClient send it as multipart/form-data automatically.
    return this.http.post<Product>(`${baseUrl}/products`, product as any);
  }

  getProducts(page: number = 1): Observable<ProductsApiResponse> {
    return this.http.get<ProductsApiResponse>(`${baseUrl}/products`, {
      params: { page: page.toString() }
    }).pipe(
      tap((response) => console.log('Products response:', response))
    );
  }
}