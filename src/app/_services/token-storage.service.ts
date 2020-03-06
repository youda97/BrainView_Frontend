import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const loggedOut = 'loggedOut';

@Injectable({
	providedIn: 'root'
})
export class TokenStorageService {

	constructor() {
		this.setLoggoutStatus('true');
	}

	signOut() {
		window.sessionStorage.clear();
	}

	public getLoggoutStatus(): string {
		return sessionStorage.getItem(loggedOut);
	}

	public setLoggoutStatus(value: string) {
		window.sessionStorage.removeItem(loggedOut);
		window.sessionStorage.setItem(loggedOut, value);
	}

	public saveToken(token: string) {
		window.sessionStorage.removeItem(TOKEN_KEY);
		window.sessionStorage.setItem(TOKEN_KEY, token);
	}

	public getToken(): string {
		return sessionStorage.getItem(TOKEN_KEY);
	}

	public saveUser(user) {
		window.sessionStorage.removeItem(USER_KEY);
		window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
	}

	public getUser() {
		return JSON.parse(sessionStorage.getItem(USER_KEY));
	}
}
