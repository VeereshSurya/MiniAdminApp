import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poem } from '../models/poem';

@Injectable({
  providedIn: 'root', // Provides this service in the root injector
})
export class PoemService {
  // Base API URL for poem-related operations
  private apiUrl = 'https://poemapi-h4hth3arageegjcw.canadacentral-01.azurewebsites.net/api';

  // HTTP options for requests, setting the Content-Type to JSON
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  /**
   * Fetches all poems from the API.
   * @returns An observable containing the list of poems.
   */
  getAllPoems(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/poems`);
  }

  /**
   * Fetches a specific poem by its ID.
   * @param id - The ID of the poem to retrieve.
   * @returns An observable containing the poem.
   */
  getPoemById(id: number): Observable<Poem> {
    const url = `${this.apiUrl}/poems/${id}`;
    return this.http.get<Poem>(url);
  }

  /**
   * Creates a new poem in the API.
   * @param poem - The poem object to be created.
   * @returns An observable containing the created poem.
   */
  createNewPoem(poem: Poem): Observable<Poem> {
    return this.http.post<Poem>(`${this.apiUrl}/poems`, poem, this.httpOptions);
  }

  /**
   * Updates an existing poem by its ID.
   * @param id - The ID of the poem to update.
   * @param poem - The updated poem object.
   * @returns An observable for the update operation.
   */
  updatePoem(id: number, poem: Poem): Observable<any> {
    const url = `${this.apiUrl}/poems/${id}`;
    return this.http.put<void>(url, poem, this.httpOptions);
  }

  /**
   * Deletes a poem by its ID.
   * @param id - The ID of the poem to delete.
   * @returns An observable for the delete operation.
   */
  deletePoem(id?: number): Observable<any> {
    if (id === undefined) {
      throw new Error('ID must be provided to delete a poem');
    }
    const url = `${this.apiUrl}/poems/${id}`;
    return this.http.delete<void>(url, this.httpOptions);
  }
}
