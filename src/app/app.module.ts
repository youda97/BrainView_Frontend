import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// carbon-components-angular default imports
import {
	UIShellModule,
	DialogModule,
	PlaceholderModule,
	TableModule,
	PaginationModule,
	SearchModule,
	ButtonModule,
	InputModule,
	ModalModule,
	ComboBoxModule
} from 'carbon-components-angular';
import { Notification20Module } from '@carbon/icons-angular/lib/notification/20';
import { UserAvatar20Module } from '@carbon/icons-angular/lib/user--avatar/20';
import { AppSwitcher20Module } from '@carbon/icons-angular/lib/app-switcher/20';
import { Cognitive20Module } from '@carbon/icons-angular/lib/cognitive/20';
import { RecentlyViewed20Module } from '@carbon/icons-angular/lib/recently-viewed/20';
import { Add20Module } from '@carbon/icons-angular/lib/add/20';
import { Delete20Module } from '@carbon/icons-angular/lib/delete/20';
import { ArrowLeft20Module } from '@carbon/icons-angular/lib/arrow--left/20';
import { Save20Module } from '@carbon/icons-angular/lib/save/20';
import { Password20Module } from '@carbon/icons-angular/lib/password/20';
import { Logout20Module } from '@carbon/icons-angular/lib/logout/20';

import { HeaderComponent } from './header/header.component';
import { SurgeonComponent } from './surgeon/surgeon.component';
import { PatientComponent } from './patient/patient.component';
import { ModalComponent } from './header/modal.component';

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		SurgeonComponent,
		PatientComponent,
		ModalComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		UIShellModule,
		Notification20Module,
		DialogModule,
		PlaceholderModule,
		TableModule,
		PaginationModule,
		SearchModule,
		ButtonModule,
		InputModule,
		ModalModule,
		ComboBoxModule,
		UserAvatar20Module,
		AppSwitcher20Module,
		Cognitive20Module,
		RecentlyViewed20Module,
		Add20Module,
		Delete20Module,
		ArrowLeft20Module,
		Save20Module,
		Password20Module,
		Logout20Module
	],
	bootstrap: [AppComponent],
	entryComponents: [ModalComponent]
})
export class AppModule { }
