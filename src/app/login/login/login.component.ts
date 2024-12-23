import { Component, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterContentInit {
	angForm: FormGroup;
	isLoggedIn = false;
	role = '';
	showError = false;

	constructor(
		protected authService: AuthService,
		protected tokenStorage: TokenStorageService,
		protected cookieService: CookieService,
		protected router: Router,
		protected fb: FormBuilder) {
		this.createForm();
	}

	get invalidEmail() {
		if (this.angForm.value.email === 'admin') {
			return false;
		}
		if (this.angForm.controls['email'].invalid &&
			(this.angForm.controls['email'].dirty || this.angForm.controls['email'].touched)) {
				return true;
		}
		return false;
	}

	get invalidPassword() {
		if (this.angForm.controls['password'].invalid &&
			(this.angForm.controls['password'].dirty || this.angForm.controls['password'].touched)) {
			return true;
		}
		return false;
	}

	get disabled() {
		if (this.angForm.value.email === '' || this.angForm.value.password === '') {
			return true;
		}
		return this.angForm.pristine || this.invalidEmail || this.invalidPassword;
	}

	ngAfterContentInit() {
		if (this.tokenStorage.getToken()) {
			this.isLoggedIn = true;
			this.role = this.tokenStorage.getUser().role;
			const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
			let username = this.tokenStorage.getUser().email;
			if (re.test(username)) {
				username = username.substring(0, username.indexOf('@'));
			}
			this.router.navigateByUrl(`/${username}/patients`);
		}
	}

	createForm() {
		// TODO: Make admin password 6 characters
		this.angForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(5)]]
		});
	}

	onSubmit() {
		this.showError = false;
		const creds = 'username=' + this.angForm.value.email + '&password=' + this.angForm.value.password;

		this.authService.login(creds).subscribe(
			resp => {
				const user = {
					role: resp.body.role,
					email: this.angForm.value.email
				};
				this.tokenStorage.saveToken(resp.body.session);
				this.tokenStorage.saveUser(user);

				this.tokenStorage.setLoggoutStatus('false');
				this.isLoggedIn = true;
				this.role = this.tokenStorage.getUser().role;
				this.reloadPage();
			},
			err => {
				this.showError = true;
				console.log('error ', err);
			}
		);
	}

	reloadPage() {
		window.location.reload();
	}
}
