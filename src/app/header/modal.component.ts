import { Component, ViewEncapsulation } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { DataService } from '../_services/data.service';

@Component({
	selector: 'app-sample-modal',
	template: `
	  <ibm-modal>
		<ibm-modal-header (closeSelect)="closeModal()">
			<p class="bx--modal-header__heading bx--type-beta">Change Password</p>
		</ibm-modal-header>
		<section class="bx--modal-content">
		<div class="notifications">
			<ibm-notification
				*ngIf="showError"
				(close)="showError = false"
				[notificationObj]="{
					type: 'error',
					title: 'Error',
					message: 'Current password is invalid',
					showClose: true,
					lowContrast: true
				}">
			</ibm-notification>
		</div>
		  <h1>Need to reset your password? No problem. Just fill in the fields below.</h1>
			<form class="bx--form" [formGroup]="angForm" novalidate>
				<ibm-label class="bx--input" [invalid]="invalidCurrentPassword" invalidText='Must have at least 6 character'>
					Current Password
					<input ibmText type="password" name="currentPassword" formControlName="currentPassword" placeholder="currentPassword">
				</ibm-label>
				<ibm-label class="bx--input" [invalid]="invalidPassword" invalidText='Must have at least 6 character'>
					Password
					<input ibmText type="password" name="password" formControlName="password" placeholder="Password">
				</ibm-label>
				<ibm-label class="bx--input" [invalid]="invalidConfirmPassword" invalidText='Password does no match'>
					Confirm Password
					<input ibmText type="password" name="confirmPassword" formControlName="confirmPassword" placeholder="Password">
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
    styles: [`
        .notifications {
            position: fixed;
			width: 100%;
			max-width: 34.5rem;
			top: 0;
			z-index: 1;
        }

        .bx--inline-notification--low-contrast {
			animation: 0.5s ease-out 0s 1 slideInFromLeft;
		}
        
        @keyframes slideInFromLeft {
			0% {
				transform: translateX(-45%);
			}
			100% {
				transform: translateX(0);
			}
		}
    `],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent extends BaseModal {
	angForm: FormGroup;
	disabled = true;
	showError = false;
	role = '';
	
	get invalidCurrentPassword() {
		if (this.angForm.controls['currentPassword'].invalid &&
			(this.angForm.controls['currentPassword'].dirty || this.angForm.controls['currentPassword'].touched)) {
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

	get invalidConfirmPassword() {
		if (this.angForm.controls['confirmPassword'].invalid &&
			(this.angForm.controls['confirmPassword'].dirty || this.angForm.controls['confirmPassword'].touched)) {
			return true;
		}
		return false;
	}

	constructor(
		protected modalService: ModalService,
		protected fb: FormBuilder,
		protected authService: AuthService,
		protected data: DataService,
		protected tokenStorage: TokenStorageService) {
		super();
		this.createForm();
	}

	ngOnInit() {
		if (this.tokenStorage.getToken()) {
			this.role = this.tokenStorage.getUser().role;
		}
	}

	createForm() {
		this.angForm = this.fb.group({
			currentPassword: ['', [Validators.required, Validators.minLength(6)]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword: ['', Validators.required]
		}, {
			validator: MustMatch('password', 'confirmPassword')
		});
	}

	save() {
		this.showError = false;
		let creds = 'username=' + this.tokenStorage.getUser().email + '&password=' + this.angForm.value.currentPassword;
		this.authService.login(creds).subscribe(
			() => {
				this.data.updatePassword(this.angForm, this.role).subscribe(
					() => {
						this.closeModal();
						document.body.querySelector('.bx--content').insertAdjacentHTML('afterbegin', 
							`
							<div class="notifications">
								<ibm-notification ng-reflect-notification-obj="[object Object]" id="notification" class="bx--inline-notification bx--inline-notification--success bx--inline-notification--low-contrast ng-star-inserted" role="alert" style="">
									<div class="bx--inline-notification__details">
										<ibm-icon-checkmark-filled16 class="bx--inline-notification__icon ng-star-inserted">
											<svg ibmIconCheckmarkFilled16="" ng-reflect-is-focusable="false" xmlns="http://www.w3.org/2000/svg" focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
												<path d="M8,1C4.1,1,1,4.1,1,8c0,3.9,3.1,7,7,7s7-3.1,7-7C15,4.1,11.9,1,8,1z M7,11L4.3,8.3l0.9-0.8L7,9.3l4-3.9l0.9,0.8L7,11z"></path><path d="M7,11L4.3,8.3l0.9-0.8L7,9.3l4-3.9l0.9,0.8L7,11z" data-icon-path="inner-path" opacity="0"></path>
											</svg>
										</ibm-icon-checkmark-filled16>
										<div class="bx--inline-notification__text-wrapper">
											<p class="bx--inline-notification__title">Success</p>
											<p class="bx--inline-notification__subtitle">Your password has been changed successfully!</p>
										</div>
									</div>
									<button class="bx--inline-notification__close-button ng-star-inserted" type="button" aria-label="Close alert notification">
										<ibm-icon-close16 class="bx--inline-notification__close-icon">
											<svg ibmIconClose16="" ng-reflect-is-focusable="false" xmlns="http://www.w3.org/2000/svg" focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
												<path d="M12 4.7L11.3 4 8 7.3 4.7 4 4 4.7 7.3 8 4 11.3 4.7 12 8 8.7 11.3 12 12 11.3 8.7 8z"></path>
											</svg>
										</ibm-icon-close16>
									</button>
								</ibm-notification>
							</div>
							`
						);
					},
					err => {
						this.showError = true;
						console.log("error ", err);
					},
					() => {
						setTimeout(() => {
							this.closeModal()
						}, 5000); 
					}
				);
			},
			err => {
				this.showError = true;
				console.log("error ", err);
			}
		);
	}
}
