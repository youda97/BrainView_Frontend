import { Component, AfterContentInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
	role = "";
	isLoggedIn = false;

	constructor(private tokenStorage: TokenStorageService) { }

	ngAfterContentInit() {
		if (this.tokenStorage.getToken()) {
			this.isLoggedIn = true
			this.role = this.tokenStorage.getUser().role;
			console.log("app ", this.tokenStorage.getUser());
		}
	}
}
