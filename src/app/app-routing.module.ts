import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { TokenStorageService } from './_services/token-storage.service';

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
	constructor(router: Router, private tokenStorage: TokenStorageService) {
		const config = router.config;
		const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

		if (this.tokenStorage.getToken()) {
			let username = this.tokenStorage.getUser().email
			if (re.test(username)) {
				username = username.substring(0, username.indexOf('@'));
			}
			config.push(
				{
					path: `${username}/patients`,
					loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule)
				},
				{
					path: `${username}/surgeons`,
					loadChildren: () => import('./surgeon/surgeon.module').then(m => m.SurgeonModule)
				}
			);
		}
	}
}
