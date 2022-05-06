import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TwitterHandleService {
  // Define base URL

  // https://api.twitter.com/
  // Proxy used to ignore CORS error, proxy.conf.json
  // Mapping of baseURL: '2' -> 'https://api.twitter.com/2'
  baseURL = '2';

  // TODO: add bearer token (not shown in git repo), use of env variables encouraged
  bearerToken = '';

  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.bearerToken}`,
    }),
    // responseType: 'text' as 'json',
  };

  // https://api.twitter.com/2/tweets?ids=1392798127133020161&tweet.fields=created_at&expansions=author_id&user.fields=created_at
  getTweet(tweetId: string) {
    let apiURL =
      this.baseURL +
      '/tweets?ids=' +
      tweetId +
      '&tweet.fields=created_at&expansions=author_id&user.fields=created_at';
    console.log(`attempting to get response from URL ${apiURL}`);
    return this.http
      .get<Object>(apiURL, this.httpOptions)
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
