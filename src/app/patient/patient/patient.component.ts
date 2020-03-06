import { Component, ViewEncapsulation } from '@angular/core';
import { ModalService } from 'carbon-components-angular';
import { SearchPatientComponent } from './search-patient.component';
import { AddPatientComponent } from './add-patient.component';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
	selector: 'app-patient',
	templateUrl: './patient.component.html',
	styleUrls: ['./patient.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PatientComponent {

	constructor(protected modalService: ModalService, protected tokenStorage: TokenStorageService) {}

	openManageModal() {
		event.preventDefault();
		this.modalService.create({
			component: SearchPatientComponent
		});
	}

	openAddModal() {
		event.preventDefault();
		this.modalService.create({
			component: AddPatientComponent
		});
	}
}
