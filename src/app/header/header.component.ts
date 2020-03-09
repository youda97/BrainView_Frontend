import {
	Component,
	HostBinding,
	ElementRef,
	HostListener,
	ViewEncapsulation,
	AfterContentInit
} from '@angular/core';

import { ModalService, ModalButton } from 'carbon-components-angular';
import { ModalComponent } from './modal.component';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements AfterContentInit {
	// adds padding to the top of the document, so the content is below the header
	@HostBinding('class.bx--header') headerClass = true;

	isLarge = false;
	username = '';
	role = '';
	buttons = [
		{
			text: 'No',
			type: 'secondary',
		},
		{
			text: 'Yes',
			type: 'primary',
			click: () => this.confirmLogout(),
		},
	] as ModalButton[];

	constructor(
		protected tokenStorage: TokenStorageService,
		protected modalService: ModalService,
		protected router: Router,
		protected elementRef: ElementRef) {}

	ngAfterContentInit() {
		this.sideNavExpand(window);

		if (this.tokenStorage.getToken()) {
			this.role = this.tokenStorage.getUser().role === 'ROLE_ADMIN' ? 'Admin' : 'Surgeon';
			const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
			this.username = this.tokenStorage.getUser().email;
			if (re.test(this.username)) {
				this.username = this.username.substring(0, this.username.indexOf('@'));
			}
		}
	}

	openModal(tooltip) {
		this.modalService.create({
			component: ModalComponent
		});
		tooltip.doClose();
	}

	logout(tooltip) {
		this.modalService.show({
			title: 'Logout',
			content: 'Are you sure you want to logout?',
			buttons: this.buttons
		});
		tooltip.doClose();
	}

	confirmLogout() {
		this.tokenStorage.signOut();
		this.router.navigateByUrl('/');
		setTimeout(() => {
			this.reloadPage();
		});
	}

	reloadPage() {
		window.location.reload();
	}

	sideNavExpand(event) {
		this.isLarge = event.innerWidth < 1056 ? false : true;
		setTimeout(() => {
			if (this.elementRef.nativeElement.querySelector('ibm-sidenav')) {
				this.elementRef.nativeElement.querySelector('ibm-sidenav').classList.add('bx--side-nav--rail');
			}
		});
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.sideNavExpand(event.target);
	}
}
