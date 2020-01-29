import {
	Component,
	ViewEncapsulation,
} from '@angular/core';

import {
	ModalButton,
	ModalService
} from 'carbon-components-angular';
import { FormGroup, FormBuilder,  Validators } from '@angular/forms';
import { SearchPatientComponent } from './search-patient.component'
import { AddPatientComponent } from './add-patient.component'
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
	selector: 'app-patient',
	templateUrl: './patient.component.html',
	styleUrls: ['./patient.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PatientComponent {
	buttons = [
		{
			text: 'No',
			type: 'secondary',
		},
		{
			text: 'Yes',
			type: 'primary',
			click: () => alert('hi'),
		},
	] as ModalButton[];

	constructor(protected modalService: ModalService, protected tokenStorage: TokenStorageService) {}

	openModelModal() {
		event.preventDefault();
		this.modalService.create({
			component: SearchPatientComponent,
			inputs: {
				modalText: 'model',
			},
		});
	}

	openSurgeonModal() {
		event.preventDefault();
		this.modalService.create({
			component: SearchPatientComponent,
			inputs: {
				modalText: 'surgeon',
			},
		});
	}

	openAddModal() {
		event.preventDefault();
		this.modalService.create({
			component: AddPatientComponent
		});
	}
}
