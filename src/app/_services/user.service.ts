import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    getPublicContent(): Observable<any> {
        return this.http.get(API_URL, { responseType: 'text' });
    }

    getUserBoard(): Observable<any> {
        return this.http.get(API_URL + 'patient', { responseType: 'text' });
    } 

    getAdminBoard(card, surgeon): Observable<any> {
        var options = '/patient?healthcard=' + card + '&surgeon=' + surgeon;
        return this.http.get(API_URL + 'admin' + options , { responseType: 'text' });
    }
}