import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';

import { TilesModule, InputModule, ButtonModule } from 'carbon-components-angular';

@NgModule({
	declarations: [LoginComponent],
	imports: [
		CommonModule,
		LoginRoutingModule,
		TilesModule,
		InputModule,
		ButtonModule
	]
})
export class LoginModule { }
