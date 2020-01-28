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

	hasHamburger = true;
	active = false;
	username = "";
	role = "";
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
		private tokenStorage: TokenStorageService,
		protected modalService: ModalService,
		private router: Router,
		protected elementRef: ElementRef) {}

	ngAfterContentInit() {
		if (this.tokenStorage.getToken()) {
			this.role = this.tokenStorage.getUser().role === 'ROLE_ADMIN' ? 'Admin' : 'Surgeon';
			const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
			this.username = this.tokenStorage.getUser().email
			if (re.test(this.username)) {
				this.username = this.username.substring(0, this.username.indexOf('@'));
			}

			setTimeout(() => {
				this.resizeSidenav(window);
			}, 0);
			
		}
	}

	expanded() {
		if (this.elementRef.nativeElement.querySelector('ibm-sidenav').classList.contains('bx--side-nav--expanded')) {
			this.elementRef.nativeElement.nextElementSibling.classList.add('bx--push-content');
		} else {
			this.active = false;
			this.elementRef.nativeElement.nextElementSibling.classList.remove('bx--push-content');
			this.elementRef.nativeElement.querySelector('ibm-sidenav').classList.add('bx--side-nav--rail');
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
		setTimeout(() => this.reloadPage()); 
	}

	resizeSidenav(event) {
		if (this.role !== 'Admin') {
			return;
		}
		if (event.innerWidth < 1056) {
			this.active = false;
			this.hasHamburger = false;
			this.elementRef.nativeElement.nextElementSibling.classList.remove('bx--push-content');
			this.elementRef.nativeElement.querySelector('ibm-sidenav').classList.add('bx--side-nav--rail');
		} else {
			this.hasHamburger = true;
			this.active = true;
			this.elementRef.nativeElement.nextElementSibling.classList.add('bx--push-content');
		}
	}

	reloadPage() {
		window.location.reload();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.resizeSidenav(event.target);
	}
}
