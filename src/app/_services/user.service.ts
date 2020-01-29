import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    getUserBoard(path, type): Observable<any> {
        return this.http.get(API_URL + path, { responseType: type });
    }

    getAdminBoard(path, type): Observable<any> {
        return this.http.get(API_URL + 'admin' + path, { responseType: type });
    }
}