import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-sample-modal',
	template: `
	  <ibm-modal (overlaySelected)="closeModal()">
		<ibm-modal-header (closeSelect)="closeModal()">
			<p class="bx--modal-header__heading bx--type-beta">Search Patient</p>
		</ibm-modal-header>
		<section class="bx--modal-content">
			<ibm-notification *ngIf="isSuccess" [notificationObj]="{
				type: 'success',
				title: 'Success',
				message: 'Patient has been updated',
				showClose: true,
				lowContrast: true}">
			</ibm-notification>
			<form class="bx--form" [formGroup]="angForm" novalidate style="height: 120px;">
				<ibm-label class="bx--input" style="float: left; width: 350px">
					Health card number
					<input ibmText name="healthCard" formControlName="healthCard" placeholder="Search">
                </ibm-label>
                <button class="bx--btn bx--btn--primary" [disabled]="angForm.invalid" (click)="search()">
                    Search
                </button>
			</form>
			
			<form *ngIf="isSearch && tokenStorage.getUser().role === 'ROLE_ADMIN'" style="width: 530.32px; padding: 24px;">
				<ibm-label *ngIf="modalText === 'surgeon'" class="bx--input bx--form-item">
                    <label class="bx--label">Assigned to:</label>
                    <div class="bx--text-input__field-wrapper">
                        <ibm-combo-box
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
					*ngIf="modalText === 'model'"
					title="Model"
					description="only .obj files. 16mb max file size."
					[(files)]="files"
					[accept]="accept">
				</ibm-file-uploader>
			</form>

			<form *ngIf="isSearch && tokenStorage.getUser().role === 'ROLE_USER'" style="padding: 24px">
				<ibm-file-uploader
					title="Model"
					description="only .obj files. 16mb max file size."
					[(files)]="files"
					[accept]="accept">
				</ibm-file-uploader>
			</form>			
		</section>
		<ibm-modal-footer>
			<button class="bx--btn bx--btn--secondary" (click)="closeModal()">
				Cancel
			</button>
			<button class="bx--btn bx--btn--primary" (click)="update()">
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

		.bx--file__selected-file {
			margin-top: 20px;
			background-color: #f4f4f4; 
		}
	`],
	encapsulation: ViewEncapsulation.None
})
export class SearchPatientComponent extends BaseModal {
	angForm: FormGroup;
	disabled = true;

	isSearch = false;
	surgeons = [];
	selectedSurgeon;

	files = new Set<any>();
	accept = ['.obj'];
	
	isSuccess = false;

	constructor(
		@Inject('modalText') public modalText,
		protected modalService: ModalService,
		protected fb: FormBuilder,
		private userService: UserService,
		protected http: HttpClient,
		private tokenStorage: TokenStorageService) {
		super();
		this.createForm();
	}

	createForm() {
		this.angForm = this.fb.group({
			healthCard: ['', Validators.required]
        });
	}

	selectSurgeon(event) {
		this.selectedSurgeon = event;
	}

	search() {
		if (this.tokenStorage.getUser().role === 'ROLE_ADMIN') {
			this.userService.getAdminBoard('/neurosurgeon', 'json').subscribe(
				data => {
					this.isSearch = true;
					const items = data.surgeons
					this.userService.getAdminBoard(`/patient/surgeon?healthcard=${this.angForm.value.healthCard}`, 'json').subscribe(
						data => {
							items.forEach(surgeon => {
								if (surgeon.content === data.content) {
									surgeon.selected = true;
								}
							});
			
							this.surgeons = items;
						},
						err => {
							this.isSearch = false;
							console.log(err);
						}
					);
				},
				err => {
					console.log(err);
				}
			);
		}

		this.userService.getUserBoard(`patient?healthcard=${this.angForm.value.healthCard}`, 'blob').subscribe(
			() => {
				console.log('ji');
				this.isSearch = true;
			},
			err => {
				this.isSearch = false;
				console.log(err);
			}
		);
	}

	update() {
		if (this.tokenStorage.getUser().role === 'ROLE_ADMIN') {
			if (this.modalText === 'surgeon') {
				var creds = 'healthcard=' + this.angForm.value.healthCard + '&surgeon=' + this.selectedSurgeon.item.content;
				this.http.put('http://localhost:8080/api/admin/patient', creds, {
				headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
				observe: 'response',
				withCredentials: true}).subscribe(
					data => {
						this.isSuccess = true;
						// setTimeout(() => {
						// 	this.isSuccess = false;
						// }, 5000);
						console.log('update ', data);
					},
					err => {
						console.log(err);
					}
				);
			} else if (this.modalText === 'model') {
				this.updateModel();
			}
		} else {
			this.updateModel();
		}
	}

	updateModel() {
		var it = this.files.values();
		var first = it.next();
		var value = first.value;

		Observable.create(observer => {
			var formData: FormData = new FormData()
			var xhr: XMLHttpRequest = new XMLHttpRequest();
	
			formData.append("file", value.file);
			formData.append('healthcard', this.angForm.value.healthCard);

			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						// observer.next(JSON.parse(xhr.response));
						observer.complete();
					} else {
						observer.error(xhr.response);
					}
				}
			};
	
			xhr.open('PUT', 'http://localhost:8080/api/patient', true);
			this.isSuccess = true;
			// setTimeout(() => {
			// 	this.isSuccess = false;
			// }, 5000);
			xhr.withCredentials = true;
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.send(formData);
		}).subscribe(
			data => {
				console.log("data ", data);
			},
			err => {
				console.log("error ", err);
			}
		);
	}
}