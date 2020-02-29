import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private tokenStorage: TokenStorageService, private http: HttpClient) { }

    deletePatient(angForm) {
        var creds = 'patient?healthcard=' + angForm.value.healthCard;
        return this.http.delete(API_URL + creds, {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
            observe: 'response',
            withCredentials: true
        })
    }

    updateSurgeon(angForm, selectedSurgeon) {
        var creds = 'healthcard=' + angForm.value.healthCard + '&surgeon=' + selectedSurgeon;
        return this.http.put(API_URL + 'admin/patient', creds, {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
            observe: 'response',
            withCredentials: true
        })
    }

    manageFile(value, angForm, request, input?) {
        return Observable.create(observer => {
            var formData: FormData = new FormData()
            var xhr: XMLHttpRequest = new XMLHttpRequest();
        
            formData.append("file", value.file);
            formData.append('healthcard', angForm.value.healthCard);
            if (request === "POST") {
                if (this.tokenStorage.getUser().role === 'ROLE_ADMIN') {
                    formData.append('surgeon', input.value);
                } else {
                    formData.append('surgeon', this.tokenStorage.getUser().email);
                }
                formData.append('firstName', angForm.value.firstName);
                formData.append('lastName', angForm.value.lastName);
            }
        
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(xhr.response);
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };
        
            if (request === "POST") {
                if (this.tokenStorage.getUser().role === 'ROLE_ADMIN') {
                    xhr.open(request, API_URL + 'admin/patient', true);
                } else {
                    xhr.open(request, API_URL + 'patient', true);
                }
            } else if (request === "PUT") {
                xhr.open(request, API_URL + 'patient', true);
            }

            xhr.withCredentials = true;
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(formData);
            value.state = 'upload';
        })
    }
}