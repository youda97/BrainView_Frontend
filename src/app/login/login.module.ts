import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';

import {
	TilesModule,
	InputModule,
	ButtonModule,
	NotificationModule
} from 'carbon-components-angular';

@NgModule({
	declarations: [LoginComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		LoginRoutingModule,
		TilesModule,
		InputModule,
		ButtonModule,
		NotificationModule
	]
})
export class LoginModule { }
