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
	// isLoggedIn = false;
	role = '';

	constructor(
		private authService: AuthService,
		private tokenStorage: TokenStorageService,
		private cookieService: CookieService,
		private router: Router,
		private fb: FormBuilder) {
		this.createForm();
	}

	get invalidEmail() {
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

	ngAfterContentInit() {
		if (this.tokenStorage.getToken()) {
			// this.isLoggedIn = true;
			this.role = this.tokenStorage.getUser().role;
			const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
			let username = this.tokenStorage.getUser().email
			if (re.test(username)) {
				username = username.substring(0, username.indexOf('@'));
			}
			this.router.navigateByUrl(`/${username}/patients`);
		}
	}

	createForm() {
		this.angForm = this.fb.group({
			// email: ['', [Validators.required, Validators.email]],
			// password: ['', [Validators.required, Validators.minLength(6)]]
			email: ['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(4)]]
		});
	}

	onSubmit() {
		this.authService.login(this.angForm.value).subscribe(
			() => {
				const user = {
					role: this.cookieService.get('ROLE'),
					email: this.angForm.value.email
				};
				this.tokenStorage.saveToken(this.cookieService.get('JSESSIONID'));
				this.tokenStorage.saveUser(user);

				// this.isLoggedIn = true;
				this.role = this.tokenStorage.getUser().role;
				this.reloadPage();
			},
			err => {
				console.log("error ", err);
			}
		);
	}

	reloadPage() {
		window.location.reload();
	}
}
