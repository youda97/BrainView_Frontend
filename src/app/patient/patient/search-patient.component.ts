import {
	Component,
	ViewEncapsulation,
	ElementRef,
	OnInit,
	HostListener
} from '@angular/core';
import { BaseModal, ModalService, ModalButton } from 'carbon-components-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from '../../_services/token-storage.service';
import { DataService } from '../../_services/data.service';
import { saveAs as importedSaveAs } from "file-saver";
import { FileItem } from 'carbon-components-angular/file-uploader/file-item.interface';

@Component({
	selector: 'app-sample-modal',
	template: `
	  <ibm-modal>
		<ibm-modal-header (closeSelect)="closeModal()">
			<p class="bx--modal-header__heading bx--type-beta">Search Patient</p>
		</ibm-modal-header>
		<section class="bx--modal-content">
			<div class="notifications">
				<ibm-notification
					*ngIf="showSuccess"
					(close)="showSuccess = false"
					[notificationObj]="{
						type: 'success',
						title: 'Success',
						message: 'Patient has been updated',
						showClose: true,
						lowContrast: true
					}">
				</ibm-notification>
				<ibm-notification
					*ngIf="showInfo"
					(close)="showInfo = false"
					[notificationObj]="{
						type: 'info',
						title: 'Info',
						message: patientName + ' has been found',
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
						message: 'Patient was not found',
						showClose: true,
						lowContrast: true
					}">
				</ibm-notification>
			</div>
			<ibm-loading *ngIf="isLoading" [overlay]="true"></ibm-loading>

			<ibm-content-switcher *ngIf="role === 'ROLE_ADMIN'" (selected)="selectedContent($event)">
				<button ibmContentOption name="First">Assigned surgeon</button>
				<button ibmContentOption name="Second">Model</button>
			</ibm-content-switcher>

			<form class="bx--form" [formGroup]="angForm" novalidate style="height: 120px;">
				<ibm-label
					class="bx--input"
					[invalid]="invalidHealthCard"
					invalidText='A valid health card is required'
					style="float: left; width: 350px">
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
						placeholder="Search">
                </ibm-label>
                <button class="bx--btn bx--btn--primary" [disabled]="searchDisabled" (click)="search()">
                    Search
                </button>
			</form>

			<form class="bx--manage-patient-form">
				<ibm-label *ngIf="role === 'ROLE_ADMIN' && selectedName === 'First'" class="bx--input bx--form-item">
                    <label class="bx--label">Assigned to:</label>
                    <div class="bx--text-input__field-wrapper">
						<ibm-combo-box
							[disabled]="dropdownDisabled"
                            placeholder="Select Surgeon"
                            [invalid]="invalidSurgeon"
                            invalidText='A valid value is required'
							style="width: 100%;"
							[items]="surgeons"
                            (selected)="selectSurgeon($event)">
                            <ibm-dropdown-list></ibm-dropdown-list>
                        </ibm-combo-box>
                    </div>
				</ibm-label>

				<ibm-file-uploader
					*ngIf="(role === 'ROLE_ADMIN' && selectedName === 'Second') || role === 'ROLE_USER'"
					title="Model"
					description="only .obj files. 4mb max file size."
					[(files)]="files"
					[disabled]="disabledFile"
					[multiple]="false"
					[accept]="accept"
					(download)="downloadFile()"
					(filesChange)="onFileAdd()">
				</ibm-file-uploader>
			</form>		
		</section>
		<ibm-modal-footer>
			<button class="bx--btn bx--btn--secondary" [disabled]="!isModelFound" (click)="deletePatient()">
				delete
			</button>
			<button class="bx--btn bx--btn--primary" [disabled]="updateDisabled" (click)="update()">
				update
			</button>
		</ibm-modal-footer>
	  </ibm-modal>
    `,
	styles: [`
		form > .bx--btn {
			margin-top: 26px;
			margin-left: 9px;
			min-height: 0;
			padding-top: 8px;
			padding-bottom: 8px;
			float: left;
			bottom: 0;
		}

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
		
		.bx--modal-container {
			overflow: visible;
		}

		.bx--modal-content {
			overflow-y: visible;
		}

		.bx--content-switcher {
			width: 300px;
			background: black;
			border: solid black 1px;
			border-radius: 5px;
			margin: 0 auto;
			margin-top: 20px;
		}

		.bx--content-switcher-btn.bx--content-switcher--selected {
			z-index: 0;
		}

		.bx--content-switcher-btn:hover, .bx--content-switcher-btn:active {
			z-index: 0;
		}


		.bx--manage-patient-form {
			width: 530.32px;
			padding: 24px;
			height: 208px;
			padding-top: 15px;
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
export class SearchPatientComponent extends BaseModal implements OnInit {
	role = '';
	angForm: FormGroup;

	selectedName = "First";
	invalidLength = true;

	surgeons = [];
	selectedSurgeon = '';
	inputtedSurgeon = ''
	isSurgeonSelected = false;
	dropdownTouched = false;
	dropdownDisabled = true;

	blob: Blob;
	files = new Set<any>();
	accept = ['.obj'];
	disabledFile = true;

	isLoading = false;
	isSurgeonsFound = false;
	isModelFound = false;
	
	showSuccess = false;
	showDeleteSuccess = false;
	showInfo = false;
	showError = false;
	patientName = "Pateint";

	buttons = [{
			text: 'Cancel',
			type: 'secondary'
		}, {
			text: 'Delete',
			type: 'danger',
			click: () => this.delete()
	}] as Array<ModalButton>;
	
	protected maxSize = 4000000;

    get invalidHealthCard() {
        if ((this.invalidLength || this.angForm.controls['healthCard'].invalid) &&
            (this.angForm.controls['healthCard'].dirty || this.angForm.controls['healthCard'].touched)) {
            return true;
        }
        return false;
	}
	
	get invalidSurgeon() {
        return this.dropdownTouched && !this.isSurgeonSelected; 
	}
	
	get searchDisabled() {
		return this.angForm.invalid;
	}

	get updateDisabled() {
		if (this.role === "ROLE_ADMIN" && this.selectedName === "First") {
			return !this.isSurgeonSelected;
		} else {
			if (this.role === "ROLE_ADMIN" && this.files.size > 0) {
				return !this.isSurgeonSelected || this.getFileItem().invalid;
			} else if (this.role === "ROLE_USER" && this.files.size > 0) {
				return this.getFileItem().invalid;
			} else {
				return true;
			}
        }
	}
	
	constructor(
		protected modalService: ModalService,
		protected elementRef: ElementRef,
		protected fb: FormBuilder,
		protected userService: UserService,
		protected http: HttpClient,
		protected tokenStorage: TokenStorageService,
		protected data: DataService) {
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
			healthCard: ['', Validators.required]
        });
	}

	selectSurgeon(event) {
		this.selectedSurgeon = event;
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

	createFileItem(file): FileItem {
		return {
			uploaded: false,
			state: "edit",
			invalid: false,
			invalidText: "",
			file: file
		};
	}
	
	search() {
		this.isLoading = true;
		this.showError = false;

		this.userService.getUserBoard(`patient?healthcard=${this.angForm.value.healthCard}`, 'blob').subscribe(
			response => {
				this.blob = new Blob([response], { type: 'application/octet-stream' });
				const file = new File([response], this.patientName + "'s Model.obj");
				const fileItem = this.createFileItem(file);
				this.files.clear();
				this.files.add(fileItem);

				this.isModelFound = true;
				this.showError = false;

				if (this.role === 'ROLE_USER') {
					this.userService.getUserBoard(`patient/info?healthcard=${this.angForm.value.healthCard}`, 'json').subscribe(
						data => {
							this.patientName = data.firstName + " " + data.lastName;
						},
						err => {
							console.log(err);
						}
					);
					this.isLoading = false;
					this.showInfo = true;
				}
			},
			err => {
				this.isModelFound = false;
				this.isLoading = false;
				this.showError = true;
				console.log(err);
			},
			() => {
				this.disabledFile = false;

				if (!this.isModelFound || this.role !== 'ROLE_ADMIN') {
					this.isLoading = false;
					return;
				}

				this.userService.getAdminBoard('/neurosurgeon', 'json').subscribe(
					data => {
						this.dropdownDisabled = false;
						this.isSurgeonsFound = true;
		
						const items = data.surgeons.map(({ username: content, ...rest }) => ({ content, ...rest }))

						this.userService.getUserBoard(`patient/info?healthcard=${this.angForm.value.healthCard}`, 'json').subscribe(
							data => {
								this.patientName = data.firstName + " " + data.lastName;

								items.forEach(surgeon => {
									if (surgeon.content === data.neurosurgeon) {
										surgeon.selected = true;
										this.selectedSurgeon = data.neurosurgeon;
										this.isSurgeonSelected = true;
									}
								});
								this.surgeons = items;

								this.isLoading = false;
								this.showError = false;
								this.showInfo = true;
							},
							err => {
								this.isSurgeonsFound = false;
								this.isLoading = false;
								this.showError = true;
								console.log(err);
							}
						);
					},
					err => {
						this.isLoading = false;
						this.showError = true;
						console.log(err);
					}
				);
			}
		);
	}

	update() {
		this.showError = false;
		this.isLoading = true;

		if (this.role === "ROLE_ADMIN" && this.selectedName === "First") {
			this.data.updateSurgeon(this.angForm, this.selectedSurgeon).subscribe(
				() => {
					this.isLoading = false;
					this.showSuccess = true;
					this.showError = false;
					setTimeout(() => {
						this.showSuccess = false;
					}, 5000);
				},
				err => {
					this.isLoading = false;
					this.showError = true;
					console.log(err);
				}
			);
		} else if ((this.role === "ROLE_ADMIN" && this.selectedName === "Second") || this.role === "ROLE_USER") {
			this.updateModel();
		}
	}

	updateModel() {
		const fileItem = this.getFileItem();
		this.data.manageFile(fileItem, this.angForm, "PUT").subscribe(
			() => {
                if (fileItem.file.size < this.maxSize) {
                    fileItem.state = 'complete'
                    fileItem.uploaded = true;
					this.showSuccess = true;
					this.showError = false;
					this.isLoading = false;
                    setTimeout(() => {
                        this.showSuccess = false;
                    }, 5000);
				}
			},
			error => {
				this.showError = true;
				console.log("error ", error);
			}
		);
	}

	delete() {
		this.isLoading = true;

		this.data.deletePatient(this.angForm).subscribe(
			() => {
				this.closeModal();
			},
			error => {
				this.isLoading = false;
				console.log("error ", error);
			},
			() => {
				this.isLoading = false;
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
									<p class="bx--inline-notification__subtitle">Patient has been deleted</p>
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
			}
		);
	}

	deletePatient() {
		// TODO: Add pateint name
		this.modalService.show({
			modalType: 'danger',
			title: 'Deleting pateint' ,
			content: 'Are you sure you want to remove this patient?',
			buttons: this.buttons
		});
	}

	downloadFile() {
		importedSaveAs(this.blob, this.getFileItem().file.name);
	}

	getFileItem() {
        //get iterator:
        var it = this.files.values();
        //get first entry:
        var first = it.next();
        //get value out of the iterator entry:
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

        for (var i = 0; i < format.length && idx < input.length; i++) {
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
	
	selectedContent(event) {
		this.selectedName = event.name;
	}

	@HostListener('focusout',  ['$event'])
	onFocousout(event) {
		if (this.role === "ROLE_ADMIN" && this.selectedName === "First") {
			const dropdown = this.elementRef.nativeElement.querySelector('.bx--combo-box');
			if (dropdown.contains(event.target)) {
				this.dropdownTouched = true;
			}
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