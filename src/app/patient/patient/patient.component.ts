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

	constructor(protected modalService: ModalService) {}

	openSearchModal() {
		event.preventDefault();
		this.modalService.create({
			component: SearchPatientComponent
		});
	}

	openAddModal() {
		event.preventDefault();
		this.modalService.show({
			title: 'Add',
			content: 'Functionality is still WIP',
			buttons: this.buttons
		});
	}
}
