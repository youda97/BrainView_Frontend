import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { BaseModal, ModalService } from 'carbon-components-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { NotificationService } from 'carbon-components-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
	selector: 'app-sample-modal',
	template: `
	  <ibm-modal (overlaySelected)="closeModal()">
		<ibm-modal-header (closeSelect)="closeModal()">
			<p class="bx--modal-header__heading bx--type-beta">Add Patient</p>
		</ibm-modal-header>
        <section class="bx--modal-content">
            <ibm-notification *ngIf="isSuccess" [notificationObj]="{
                type: 'success',
                title: 'Success',
                message: 'Patient has been added',
                showClose: true,
                lowContrast: true}">
            </ibm-notification>

			<form class="bx--form" [formGroup]="angForm" novalidate>
                
                <ibm-label
                class="bx--input"
                [invalid]="invalidHealthCard"
                invalidText='A value is required'>
                    Health card number
                    <input
                        ibmText
                        theme="light"
                        name="healthCard"
                        formControlName="healthCard"
                        placeholder="Number">
                </ibm-label>

                <ibm-label *ngIf="tokenStorage.getUser().role === 'ROLE_ADMIN'" class="bx--input bx--form-item">
                    <label class="bx--label">Surgeon</label>
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
		<button class="bx--btn bx--btn--primary" (click)="add()">
            Add
        </button>
        </ibm-modal-footer>
	  </ibm-modal>
    `,
    styles: [`
        .bx--file__selected-file {
            margin-top: 20px;
            background-color: #f4f4f4; 
        }

        .bx--list-box input[role='combobox'] {
            background-color: #f4f4f4;
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class AddPatientComponent extends BaseModal implements OnInit {
    static notificationCount = 0;

	angForm: FormGroup;
	disabled = true;
    surgeons = [];

    notificationId = `notification-${AddPatientComponent.notificationCount}`;
    files = new Set<any>();
    accept = ['.obj'];

    invalidHealthCard = false;
    invalidSurgeon = false;

    isSuccess = false;

    protected maxSize = 500000;

	constructor(
		protected modalService: ModalService,
		protected fb: FormBuilder,
        private userService: UserService,
        protected notificationService: NotificationService,
        protected elementRef: ElementRef,
        private tokenStorage: TokenStorageService) {
        super();
        AddPatientComponent.notificationCount++;
		this.createForm();
	}

    ngOnInit() {
        this.userService.getAdminBoard('/neurosurgeon', 'json').subscribe(
			data => {
                this.surgeons = data.surgeons
			  console.log('model ', data);
			},
			err => {
			  console.log(err);
			}
		);
    }

	createForm() {
		this.angForm = this.fb.group({
            healthCard: ['', Validators.required],
            surgeon: ['', Validators.required]
        });
	}
      
    selectSurgeon() {

    }

	add() {
        //get iterator:
        var it = this.files.values();
        //get first entry:
        var first = it.next();
        //get value out of the iterator entry:
        var value = first.value;


        console.log(value.file);
        console.log(this.angForm.value.healthCard)
        // console.log(input.value)


        Observable.create(observer => {
            var formData: FormData = new FormData()
            var xhr: XMLHttpRequest = new XMLHttpRequest();
    
            formData.append("file", value.file);
            formData.append('healthcard', this.angForm.value.healthCard);
            if (this.tokenStorage.getUser().role === 'ROLE_ADMIN') {
                const input =  this.elementRef.nativeElement.querySelector('.bx--combo-box').querySelector('input');
                formData.append('surgeon', input.value);
            } else {
                formData.append('surgeon', this.tokenStorage.getUser().email);
            }

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
    
            if (this.tokenStorage.getUser().role === 'ROLE_ADMIN') {
                xhr.open('POST', 'http://localhost:8080/api/admin/patient', true);
                this.isSuccess = true;
                // setTimeout(() => {
                // 	this.isSuccess = false;
                // }, 5000);
            } else {
                xhr.open('POST', 'http://localhost:8080/api/patient', true);
                this.isSuccess = true;
                // setTimeout(() => {
                // 	this.isSuccess = false;
                // }, 5000);
            }
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