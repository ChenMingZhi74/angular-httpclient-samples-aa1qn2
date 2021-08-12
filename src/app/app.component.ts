import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  data: any;
  url = 'http://localhost:5000/api/samples';

  constructor(private http: HttpClient) { }

  http_get_01() {
    this.http.get<any>(this.url).subscribe((res) => {
      this.data = res;
    });
  }

  http_get_02() {
    this.http.get<any>(this.url, { observe: 'response' })
      .subscribe((res) => {
        let response: HttpResponse<any> = res;
        let headers: HttpHeaders = res.headers;
        this.data = res.body;
      });
  }

  http_get_03() {
    let options = {
      observe: 'response' as 'response'
    }

    this.http.get<any>(this.url, options)
      .subscribe((res) => {
        let response: HttpResponse<any> = res;
        this.data = res.body;
      });
  }

  http_get_04() {
    let options = {
      observe: 'response' as 'response',
      responseType: 'text' as 'text'
    }

    this.http.get(this.url+'1', options)
      .subscribe((res) => {
        let response: HttpResponse<any> = res;
        this.data = res.body;
      });
  }

  http_get_05() {
    this.http.get(this.url, { observe: 'response', responseType: 'text' })
      .subscribe((res) => {
        let response: HttpResponse<any> = res;
        this.data = res.body;
      });
  }

  // retry & catchError
  http_get_06() {
    let options = {
      observe: 'response' as 'response',
      responseType: 'text' as 'text'
    }

    this.http.get(this.url+'1', options)
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
      .subscribe((res) => {
        let response: HttpResponse<any> = res;
        this.data = res.body;
      });
  }

  http_post_01() {
    let body = { a: 1 };
    this.http.post<any>(this.url, body)
      .subscribe((res) => {
        this.data = res;
      });
  }

  http_post_02() {
    let headers = new HttpHeaders({
      'Content-Type': 'text/json'
    });
    let options = {
      headers
    }

    let body = JSON.stringify('test');
    this.http.post<any>(this.url, body, options)
      .subscribe((res) => {
        this.data = res;
      });
  }

  ngOnInit() {
    this.http_get_02();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
