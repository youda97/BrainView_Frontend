import { Component, Inject } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';

@Component({
	selector: 'app-sample-modal',
	template: `
	  <ibm-modal (overlaySelected)="closeModal()">
		<ibm-modal-header (closeSelect)="closeModal()">
			<p class="bx--modal-header__heading bx--type-beta">Change Password</p>
		</ibm-modal-header>
		<section class="bx--modal-content">
		  <h1>Need to reset your password? No problem. Just fill in the fields below.</h1>
			<form class="bx--form" [formGroup]="angForm" novalidate>
				<ibm-label class="bx--input" [invalid]="invalidPassword" invalidText='Must have at least 6 character'>
					Password
					<input ibmText name="password" formControlName="password" placeholder="Password">
				</ibm-label>
				<ibm-label class="bx--input" [invalid]="invalidConfirmPassword" invalidText='Password does no match'>
					Confirm Password
					<input ibmText name="confirmPassword" formControlName="confirmPassword" placeholder="Password">
				</ibm-label>
			</form>
		</section>
		<ibm-modal-footer>
		  <button class="bx--btn bx--btn--secondary" (click)="closeModal()">
			Close
		  </button>
		  <button class="bx--btn bx--btn--primary" [disabled]="angForm.invalid" (click)="save()">
			Save
		  </button>
		</ibm-modal-footer>
	  </ibm-modal>
	`,
})
export class ModalComponent extends BaseModal {
	angForm: FormGroup;
	disabled = true;

	get invalidPassword() {
		if (this.angForm.controls['password'].invalid &&
			(this.angForm.controls['password'].dirty || this.angForm.controls['password'].touched)) {
			return true;
		}
		return false;
	}

	get invalidConfirmPassword() {
		if (this.angForm.controls['confirmPassword'].invalid &&
			(this.angForm.controls['confirmPassword'].dirty || this.angForm.controls['confirmPassword'].touched)) {
			return true;
		}
		return false;
	}

	constructor(protected modalService: ModalService, protected fb: FormBuilder) {
		super();
		this.createForm();
	}

	createForm() {
		this.angForm = this.fb.group({
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword: ['', Validators.required]
		}, {
			validator: MustMatch('password', 'confirmPassword')
		});
	}

	save() {

	}
}
