import { Component } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';

@Component({
	selector: 'app-sample-modal',
	template: `
	  <ibm-modal (overlaySelected)="closeModal()">
		<ibm-modal-header (closeSelect)="closeModal()">
			<p class="bx--modal-header__heading bx--type-beta">Search Patient</p>
		</ibm-modal-header>
		<section class="bx--modal-content">
			<form class="bx--form" [formGroup]="angForm" novalidate>
				<ibm-label class="bx--input" style="float: left; width: 350px">
					Health card number
					<input ibmText name="healthCard" formControlName="healthCard" placeholder="Search">
                </ibm-label>
                <button class="bx--btn bx--btn--primary" [disabled]="angForm.invalid" (click)="search()">
                    Search
                </button>
            </form>
            
		</section>
	  </ibm-modal>
    `,
    styles: [`
        .bx--btn {
            margin-top: 26px;
            margin-left: 9px;
            min-height: 0;
            padding-top: 8px;
            padding-bottom: 8px;
            float: left;
            bottom: 0;
        }
    `]
})
export class SearchPatientComponent extends BaseModal {
	angForm: FormGroup;
	disabled = true;

	constructor(
		protected modalService: ModalService,
		protected fb: FormBuilder,
		private userService: UserService) {
		super();
		this.createForm();
	}

	createForm() {
		this.angForm = this.fb.group({
			healthCard: ['', Validators.required]
        });
	}

	search() {
		this.userService.getAdminBoard(this.angForm.value.healthCard, ).subscribe(
			data => {
			  console.log(data);
			},
			err => {
			  console.log(err);
			}
		  );
	}
}