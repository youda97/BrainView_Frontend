import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurgeonComponent } from './surgeon/surgeon.component';
import { PatientComponent } from './patient/patient.component';

const routes: Routes = [
	// {
	// 	path: '',
	// 	loadChildren: () => import('./content/content.module').then(m => m.ContentModule)
	// },
	{
		path: '',
		loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
	},
	{
		path: 'surgeons',
		component: SurgeonComponent
	},
	{
		path: 'patients',
		component: PatientComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
