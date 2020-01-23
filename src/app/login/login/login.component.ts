import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	angForm: FormGroup;
	// isLoggedIn = false;
	roles: string[] = [];

	constructor(
		private authService: AuthService,
		private tokenStorage: TokenStorageService,
		private cookieService: CookieService,
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

	ngOnInit() {
		if (this.tokenStorage.getToken()) {
		  // this.isLoggedIn = true;
		  this.roles = this.tokenStorage.getUser().roles;
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
			data => {
				this.tokenStorage.saveToken(data.accessToken);
				this.tokenStorage.saveUser(data);

				console.log(data);
				console.log(document.cookie);
				console.log(this.cookieService.getAll());
				// this.isLoggedIn = true;
				// this.roles = this.tokenStorage.getUser().roles;
				// this.reloadPage();
				// console.log("onsubmit ", this.roles);
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
