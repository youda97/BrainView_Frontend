import {
	Component,
	HostBinding,
	ElementRef,
	HostListener,
	ViewEncapsulation,
	OnInit
} from '@angular/core';

import { ModalService } from 'carbon-components-angular';
import { ModalComponent } from './modal.component';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
	// adds padding to the top of the document, so the content is below the header
	@HostBinding('class.bx--header') headerClass = true;

	hasHamburger = true;
	active = true;
	isLarge = true;

	constructor(protected modalService: ModalService, protected elementRef: ElementRef) {}

	ngOnInit() {
		this.isLarge = window.innerWidth < 1056 ? false : true;
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

	openModal() {
		this.modalService.create({
			component: ModalComponent
		});
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		if (event.target.innerWidth < 1056) {
			this.isLarge = false;
			this.active = false;
			this.hasHamburger = false;
			this.elementRef.nativeElement.nextElementSibling.classList.remove('bx--push-content');
			this.elementRef.nativeElement.querySelector('ibm-sidenav').classList.add('bx--side-nav--rail');
		} else {
			this.isLarge = true;
			this.hasHamburger = true;
			this.active = true;
			this.elementRef.nativeElement.nextElementSibling.classList.add('bx--push-content');
		}
	}
}
