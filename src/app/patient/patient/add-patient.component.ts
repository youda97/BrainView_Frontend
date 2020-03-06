import {
	Component,
	OnInit,
	ElementRef,
	ViewEncapsulation,
	HostListener
} from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { NotificationService } from 'carbon-components-angular';
import { TokenStorageService } from '../../_services/token-storage.service';
import { DataService } from '../../_services/data.service';
import { saveAs as importedSaveAs } from 'file-saver';

@Component({
	selector: 'app-sample-modal',
	template: `
	  <ibm-modal>
		<ibm-modal-header (closeSelect)="closeModal()">
			<p class="bx--modal-header__heading bx--type-beta">Add Patient</p>
		</ibm-modal-header>
        <section class="bx--modal-content">
            <div class="notifications">
                <ibm-notification
                    *ngIf="showSuccess"
                    (close)="showSuccess = false;"
                    [notificationObj]="{
                        type: 'success',
                        title: 'Success',
                        message: 'Patient has been added',
                        showClose: true,
                        lowContrast: true
                    }">
                </ibm-notification>
                <ibm-notification
					*ngIf="showError"
					(close)="showError = false"
					[notificationObj]="{
						type: 'error',
						title: 'Error',
						message: 'Patient was not added',
						showClose: true,
						lowContrast: true
					}">
                </ibm-notification>
                <ibm-notification
					*ngIf="showSurgeonError"
					(close)="showSurgeonError = false"
					[notificationObj]="{
						type: 'error',
						title: 'Error',
						message: 'Surgeons cannot be loaded',
						showClose: true,
						lowContrast: true
					}">
				</ibm-notification>
            </div>

			<form class="bx--form" [formGroup]="angForm" novalidate>
                <ibm-label
                    class="bx--input"
                    [invalid]="invalidHealthCard"
                    invalidText='A valid health card is required'>
                    Health card number
                    <input
                        ibmText
                        (keypress)="limitInput($event)"
                        (keyup)="formatHealthcard($event)"
                        maxlength="15"
                        autocomplete="off"
                        theme="light"
                        name="healthCard"
                        formControlName="healthCard"
                        placeholder="Number">
                </ibm-label>

                <ibm-label
                    class="bx--input"
                    [invalid]="invalidFirstName"
                    invalidText='A first name is required'
                    style="float: left;
                    width: 50%;
                    margin-right: 5px;">
                    First name
                    <input
                        ibmText
                        theme="light"
                        name="firstName"
                        formControlName="firstName"
                        placeholder="First">
                </ibm-label>

                <ibm-label
                    class="bx--input"
                    [invalid]="invalidLastName"
                    invalidText='A last name is required'>
                    Last name
                    <input
                        ibmText
                        theme="light"
                        name="lastName"
                        formControlName="lastName"
                        placeholder="Last">
                </ibm-label>

                <ibm-label *ngIf="tokenStorage.getUser().role === 'ROLE_ADMIN'" class="bx--input bx--form-item" style="margin-top: 45px;">
                    <label class="bx--label">Surgeon</label>
                    <div class="bx--text-input__field-wrapper">
                        <ibm-combo-box
                            placeholder="Select Surgeon"
                            [invalid]="invalidSurgeon"
                            invalidText='A surgeon is required'
                            style="width: 100%;"
                            [items]="surgeons"
                            (selected)="selectSurgeon($event)">
                            <ibm-dropdown-list></ibm-dropdown-list>
                        </ibm-combo-box>
                    </div>
                </ibm-label>

                <ibm-file-uploader
                    title="Model"
                    description="only .obj files. 4mb max file size."
                    [(files)]="files"
					[multiple]="false"
					[accept]="accept"
					(download)="downloadFile()"
                    (filesChange)="onFileAdd()">
                </ibm-file-uploader>
            </form>
        </section>
        <ibm-modal-footer>

        <button class="bx--btn bx--btn--secondary" (click)="closeModal()">
            Cancel
        </button>
		<button class="bx--btn bx--btn--primary" (click)="add()" [disabled]="disabled">
            Add
        </button>
        </ibm-modal-footer>
	  </ibm-modal>
    `,
	styles: [`
        .bx--list-box input[role='combobox'] {
            background-color: #f4f4f4;
        }

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
export class AddPatientComponent extends BaseModal implements OnInit {
	role = '';
	angForm: FormGroup;

	invalidLength = true;

	surgeons = [];
	isSurgeonSelected = false;
	dropdownTouched = false;

	blob: Blob;
	files = new Set<any>();
	accept = ['.obj'];

	showSuccess = false;
	showError = false;
	showSurgeonError = false;

	protected maxSize = 4000000;

	get invalidHealthCard() {
		if ((this.invalidLength || this.angForm.controls['healthCard'].invalid) &&
			(this.angForm.controls['healthCard'].dirty || this.angForm.controls['healthCard'].touched)) {
			return true;
		}
		return false;
	}

	get invalidFirstName() {
		if (this.angForm.controls['firstName'].invalid &&
			(this.angForm.controls['firstName'].dirty || this.angForm.controls['firstName'].touched)) {
			return true;
		}
		return false;
	}

	get invalidLastName() {
		if (this.angForm.controls['lastName'].invalid &&
			(this.angForm.controls['lastName'].dirty || this.angForm.controls['lastName'].touched)) {
			return true;
		}
		return false;
	}

	get invalidSurgeon() {
		return !this.isSurgeonSelected && this.dropdownTouched;
	}

	get disabled() {
		if (this.files.size > 0) {
			let temp;
			if (this.role === 'ROLE_ADMIN') {
				temp = this.isSurgeonSelected &&
				!(this.angForm.pristine || this.angForm.invalid) &&
				!this.getFileItem().invalid;
			} else {
				temp = !(this.angForm.pristine || this.angForm.invalid) &&
				!this.getFileItem().invalid;
			}

			return !temp;
		} else {
			return true;
		}
	}

	constructor(
		protected modalService: ModalService,
		protected fb: FormBuilder,
		protected userService: UserService,
		protected notificationService: NotificationService,
		protected elementRef: ElementRef,
		protected tokenStorage: TokenStorageService,
		protected data: DataService) {
		super();
		this.createForm();
	}

	ngOnInit() {
		if (this.tokenStorage.getToken()) {
			this.role = this.tokenStorage.getUser().role;
		}

		if (this.role === 'ROLE_USER') {
			return;
		}

		this.userService.getAdminBoard('/neurosurgeon', 'json').subscribe(
			data => {
				this.surgeons = data.surgeons.map(({ username: content, ...rest }) => ({ content, ...rest }));
				this.showSurgeonError = false;
			},
			err => {
				this.showSurgeonError = true;
				console.log(err);
			}
		);
	}

	createForm() {
		this.angForm = this.fb.group({
			healthCard: ['', Validators.required],
			firstName: ['', Validators.required],
			lastName: ['', Validators.required]
		});
	}

	selectSurgeon(event) {
		this.surgeons.forEach(surgeon => {
			surgeon.selected = false;
			if (surgeon.content === event.item.content) {
				surgeon.selected = true;
				this.isSurgeonSelected = true;
			}
		});
	}

	onFileAdd() {
		const fileItem = this.getFileItem();
		if (this.files.size > 0) {
			this.blob = fileItem.file as Blob;

			if (!fileItem.uploaded) {
				if (fileItem.file.size > this.maxSize) {
					fileItem.state = 'edit';
					fileItem.invalid = true;
					fileItem.invalidText = 'File size exceeds limit';
				}
				return;
			}
		}
	}

	downloadFile() {
		importedSaveAs(this.blob, this.getFileItem().file.name);
	}

	add() {
		const fileItem = this.getFileItem();

		let input = '';
		if (this.role === 'ROLE_ADMIN') {
			input =  this.elementRef.nativeElement.querySelector('.bx--combo-box').querySelector('input');
		}

		this.showError = false;
		this.data.manageFile(fileItem, this.angForm, 'POST', input).subscribe(
			()  => {
				if (fileItem.file.size < this.maxSize) {
					fileItem.state = 'complete';
					fileItem.uploaded = true;
					this.showSuccess = true;
					this.showError = false;
					setTimeout(() => {
						this.showSuccess = false;
					}, 5000);
				}
			},
			error => {
				this.showError = true;
				console.log('error ', error);
			}
		);
	}

	getFileItem() {
		// get iterator:
		const it = this.files.values();
		// get first entry:
		const first = it.next();
		// get value out of the iterator entry:
		return first.value;
	}

	limitInput(event) {
		const input = event.target.value.replace(/-/g, '');
		const numRegExp = new RegExp(/^[0-9]*$/);
		const alphaRegExp = new RegExp(/^[a-zA-Z]+$/);

		if (input.length < 10 && !numRegExp.test(event.key)) {
			event.preventDefault();
		} else if (input.length >= 10 && !alphaRegExp.test(event.key)) {
			event.preventDefault();
		}
	}

	formatHealthcard(event) {
		let output = '';
		let idx = 0;
		const format = [4, 3, 3, 2];
		const input = event.target.value.replace(/-/g, '');

		for (let i = 0; i < format.length && idx < input.length; i++) {
			output += input.substr(idx, format[i]);
			if (idx + format[i] < input.length) {
				output += '-';
			}
			idx += format[i];
		}
		output += input.substr(idx);

		if (input.length > 0) {
			event.target.value = output;
		}

		this.invalidLength = event.target.value.length < 15 ? true : false;
	}

	@HostListener('focusout',  ['$event'])
	onFocousout(event) {
		const dropdown = this.elementRef.nativeElement.querySelector('.bx--combo-box');


		if (dropdown && dropdown.contains(event.target)) {
			this.dropdownTouched = true;
		}
	}

	@HostListener('keyup', ['$event'])
	onKeyup(event) {
		const dropdown = this.elementRef.nativeElement.querySelector('.bx--combo-box');
		if (dropdown) {
			if (!dropdown.contains(event.target)) {
				return;
			}
			const inputtedSurgeon = dropdown.querySelector('input').value;
			this.isSurgeonSelected = !this.surgeons.every(surgeon => surgeon.content !== inputtedSurgeon);
		}
	}
}
