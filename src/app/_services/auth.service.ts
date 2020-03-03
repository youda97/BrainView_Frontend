import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/login';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
//   observe: 'response'
// };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient) { }

    login(creds): Observable<any> {
      return this.http.post(AUTH_API, creds, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        observe: 'response',
        withCredentials: true
      });
    }
}