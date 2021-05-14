import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiHandleService {
  // Define base URL
  baseURL = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // HttpClient API get() method, retries only once on error
  getPing(): Observable<Object> {
    let path = '/ping';
    let apiURL = this.baseURL + path;
    return this.http
      .get<Object>(apiURL)
      .pipe(retry(1), catchError(this.handleError));
  }

  getPriceOfCoinAtDate(id: string, date: string) {
    // https://api.coingecko.com/api/v3/coins/ripple/history?date=30-12-2017
    let path = `/coins/` + id + `/history?date=` + date;
    let apiURL = this.baseURL + path;
    console.log(`Attempting to fetch ${apiURL}`);
    return this.http
      .get<Object>(apiURL)
      .pipe(retry(1), catchError(this.handleError));
  }

  getCurrentPrice(id: string) {
    // https://api.coingecko.com/api/v3/coins/ripple/
    let path = '/coins/' + id;
    let apiURL = this.baseURL + path;
    console.log(`Attempting to fetch ${apiURL}`);
    return this.http
      .get<Object>(apiURL)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAllCoins() {
    let path = '/coins/list/';
    let apiURL = this.baseURL + path;
    return this.http
      .get<any>(apiURL)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    console.log(`error message: ${errorMessage}`);
    return throwError(errorMessage);
  }
}
