import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient/patient.component';

import {
    TableModule,
	PaginationModule,
	SearchModule,
	ButtonModule,
	InputModule,
	ModalModule,
    ComboBoxModule,
    DialogModule,
	PlaceholderModule
} from 'carbon-components-angular';

import { Add20Module } from '@carbon/icons-angular/lib/add/20';
import { Delete20Module } from '@carbon/icons-angular/lib/delete/20';
import { Save20Module } from '@carbon/icons-angular/lib/save/20';

@NgModule({
	declarations: [PatientComponent],
	imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
		PatientRoutingModule,
        TableModule,
        PaginationModule,
        SearchModule,
        ButtonModule,
        InputModule,
        ModalModule,
        ComboBoxModule,
        Add20Module,
        Delete20Module,
        Save20Module,
        DialogModule,
        PlaceholderModule
	]
})
export class PatientModule { }
