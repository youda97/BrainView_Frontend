import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient/patient.component';
import { SearchPatientComponent } from './patient/search-patient.component';
import { AddPatientComponent } from './patient/add-patient.component';

import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import {
	TableModule,
	PaginationModule,
	SearchModule,
	ButtonModule,
	InputModule,
	ModalModule,
	ComboBoxModule,
	DialogModule,
	PlaceholderModule,
	GridModule,
	TilesModule,
	NotificationService,
	NotificationModule,
	DropdownModule,
	LoadingModule,
	LinkModule,
	ContentSwitcherModule
} from 'carbon-components-angular';

import { Add20Module } from '@carbon/icons-angular/lib/add/20';
import { Delete20Module } from '@carbon/icons-angular/lib/delete/20';
import { Save20Module } from '@carbon/icons-angular/lib/save/20';

import { authInterceptorProviders } from '../_helpers/auth.interceptor';

@NgModule({
	declarations: [
		PatientComponent,
		SearchPatientComponent,
		AddPatientComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
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
		PlaceholderModule,
		GridModule,
		TilesModule,
		FileUploaderModule,
		DropdownModule,
		NotificationModule,
		LoadingModule,
		LinkModule,
		ContentSwitcherModule
	],
	providers: [authInterceptorProviders, NotificationService],
	entryComponents: [SearchPatientComponent, AddPatientComponent]
})
export class PatientModule { }
