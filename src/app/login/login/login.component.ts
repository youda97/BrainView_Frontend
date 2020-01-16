import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	angForm: FormGroup;

	constructor(private fb: FormBuilder) {
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
			(this.angForm.controls['password'].dirty || this.angForm.controls['email'].touched)) {
			return true;
		}
		return false;
	}

	createForm() {
		this.angForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]]
		});
	}

	ngOnInit() {
	}

}
