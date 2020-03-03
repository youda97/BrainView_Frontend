import {
	Component,
	AfterContentInit,
	HostListener,
	ElementRef
} from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
	isLoggedIn = false;
	isLarge = true;
	role = '';

	constructor(protected elementRef: ElementRef, protected tokenStorage: TokenStorageService) { }

	ngAfterContentInit() {
		if (this.tokenStorage.getToken()) {
			this.role = this.tokenStorage.getUser().role;
			this.isLoggedIn = true
			this.pushContent(window);
		}
	}

	pushContent(event) {
		if (this.role !== 'ROLE_ADMIN') {
			return;
		}

		this.isLarge = event.innerWidth < 1056 ? false : true
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.pushContent(event.target);
	}

	@HostListener('click',  ['$event'])
	onClick(event) {
		const closeButton = this.elementRef.nativeElement.querySelector('.bx--inline-notification__close-button');

		if (closeButton && closeButton.contains(event.target)) {
			this.elementRef.nativeElement.querySelector('.bx--inline-notification').style.display = "none";
		}
	}
}
