import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeonComponent } from './surgeon.component';

describe('SurgeonComponent', () => {
	let component: SurgeonComponent;
	let fixture: ComponentFixture<SurgeonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SurgeonComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SurgeonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
