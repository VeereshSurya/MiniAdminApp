import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poem } from '../models/poem';

@Injectable({
  providedIn: 'root'
})
export class PoemService {

  private apiUrl = 'https://localhost:7072/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient) { }

  getAllPoems(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/poems`);
  }

  // Fetch a specific poem by its ID
  getPoemById(id: number): Observable<Poem> {
    const url = `${this.apiUrl}/poems/${id}`;
    return this.http.get<Poem>(url);
  }

  // Create a new poem
  createNewPoem(poem: Poem): Observable<Poem> {
    return this.http.post<Poem>(`${this.apiUrl}/poems`, poem, this.httpOptions);
  }

  // Update an existing poem
  updatePoem(id: number, poem: Poem): Observable<any> {
    const url = `${this.apiUrl}/poems/${id}`;
    return this.http.put<void>(url, poem, this.httpOptions);
  }

  // Delete a poem by ID
  deletePoem(id?: number): Observable<any> {
    const url = `${this.apiUrl}/poems/${id}`;
    return this.http.delete<void>(url, this.httpOptions);
  }
}
