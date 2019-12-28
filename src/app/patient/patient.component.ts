import {
	Component,
	OnInit,
	OnChanges,
	SimpleChanges,
	ViewChild,
	TemplateRef,
	ViewEncapsulation,
	HostListener,
	ElementRef
} from '@angular/core';

import {
	TableModel,
	TableHeaderItem,
	TableItem,
	ModalButton,
	ModalService
} from 'carbon-components-angular';
import { FormGroup, FormBuilder,  Validators } from '@angular/forms';

function sort(model, index: number) {
	if (model.header[index].sorted) {
		// if already sorted flip sorting direction
		model.header[index].ascending = model.header[index].descending;
	}
	model.sort(index);
}

@Component({
	selector: 'app-patient',
	templateUrl: './patient.component.html',
	styleUrls: ['./patient.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PatientComponent implements OnInit, OnChanges {
	model = new TableModel();
	fakeModel = new TableModel();

	newSurgeons = [];
	surgeons = [];
	data = [];
	filteredItems = [];
	sortable = true;
	title = 'Patients';
	totalDataLength = 10;
	isEditing = false;

	selectedEmail = '';
	modalType = 'danger';
	modalContent = 'Are you sure you want to remove this patient?';
	buttons = [{
			text: 'Cancel',
			type: 'secondary'
		}, {
			text: 'Delete',
			type: 'danger',
			click: () => this.delete()
	}] as Array<ModalButton>;

	disabledAdd = true;
	dropdownTouched = false;
	angForm: FormGroup;

	nameText = '';
	emailText = '';

	@ViewChild('deleteTemplate', null)
	protected deleteTemplate: TemplateRef<any>;
	@ViewChild('dropdownTemplate', null)
	protected dropdownTemplate: TemplateRef<any>;
	@ViewChild('expandedTemplate', null)
	protected expandedTemplate: TemplateRef<any>;

	constructor(protected elementRef: ElementRef,
		protected modalService: ModalService,
		protected fb: FormBuilder) {
		this.createForm();
	}

	get invalidName() {
		if (this.angForm.controls['name'].invalid &&
			(this.angForm.controls['name'].dirty || this.angForm.controls['name'].touched)) {
			return true;
		}
		return false;
	}

	get invalidEmail() {
		if (this.angForm.controls['email'].invalid &&
			(this.angForm.controls['email'].dirty || this.angForm.controls['email'].touched)) {
			return true;
		}
		return false;
	}

	get invalidSurgeon() {
		if (this.dropdownTouched && !this.newSurgeons.some(surgeon => surgeon.selected)) {
			return true;
		}
		return false;
	}

	ngOnInit() {
		this.fakeModel.header = [
			new TableHeaderItem({
				data: 'Basic Information',
				sortable: false
			})
		];

		this.model.header = [
			new TableHeaderItem({
				data: 'Name'
			}),
			new TableHeaderItem({
				data: 'Email',
			}),
			new TableHeaderItem({
				data: 'Surgeon',
				sortable: false
			}),
			new TableHeaderItem({
				data: 'Actions',
				sortable: false
			})
		];

		for (let i = 0; i < 50; i++) {
			this.surgeons.push({
				content: 'name' + i,
				selected: false
			});
		}

		for (let i = 0; i < 10; i++) {
			const newSurgeons = this.surgeons.map(a => Object.assign({}, a));

			this.data.push({
				name: 'patient name ' + i,
				email: 'email' + i + '@uwo.ca',
				surgeons: newSurgeons
			});
		}

		this.model.pageLength = 10;
		this.model.totalDataLength = this.data.length;
		this.customSort(this.data);
		this.selectPage(1);
	}

	createForm() {
		this.angForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]]
		});
	}

	selectPage(page) {
		const searchInput = this.elementRef.nativeElement.querySelector('.bx--search-input');

		const offset = this.model.pageLength * (page - 1);
		let pageRawData = this.data.slice(offset, offset + this.model.pageLength);
		if (searchInput && searchInput.value !== '' && searchInput.value !== null) {
			pageRawData = this.filteredItems.slice(offset, offset + this.model.pageLength);
		}
		this.model.data = this.prepareData(pageRawData);
		this.model.currentPage = page;
	}

	prepareData(data) {
		const newData = [];
		for (const datum of data) {
			newData.push([
				new TableItem({
					data: datum.name,
					expandedData: { name: datum.name, email: datum.email },
					expandedTemplate: this.expandedTemplate
				}),
				new TableItem({ data: datum.email }),
				new TableItem({data: datum, template: this.dropdownTemplate}),
				new TableItem({template: this.deleteTemplate})
			]);
		}
		return newData;
	}

	addNewPatient() {
		this.title = 'New Patient';
		this.disabledAdd = true;
		this.angForm.reset();
	}

	back() {
		this.title = 'Patients';
		this.disabledAdd = true;
		this.dropdownTouched = false;
		this.angForm.reset();
	}

	save(data, event) {
		this.data.forEach(item => {
			if (item.email === data.email) {
				item.name = event.target.closest('form').children[0].querySelector('input').value;
				item.email = event.target.closest('form').children[1].querySelector('input').value;

				const index = this.data.findIndex(x => x.email === item.email);
				const page = Math.floor(index / this.model.pageLength) + 1;
				this.selectPage(page);
				this.title = 'Patients';
				this.isEditing = false;
			}
		});
		this.angForm.reset();
	}

	openModal(event) {
		const name = event.target.closest('tr').children[1].innerText;
		this.selectedEmail = event.target.closest('tr').children[2].innerText;

		this.modalService.show({
			modalType: this.modalType,
			title: 'Deleting ' + name,
			content: this.modalContent,
			buttons: this.buttons
		});
	}

	delete() {
		const index = this.data.findIndex(x => x.email === this.selectedEmail);
		this.data.splice(index, 1);
		this.model.totalDataLength = this.data.length;
		const page = Math.floor(index / this.model.pageLength) + 1;
		this.selectPage(page);
	}

	add() {
		const item = {
			name: this.elementRef.nativeElement.querySelector('[name=\'name\']').value,
			email: this.elementRef.nativeElement.querySelector('[name=\'email\']').value,
			surgeons: this.newSurgeons
		};

		this.data.push(item);
		this.model.totalDataLength = this.data.length;
		this.customSort(this.data);
		this.selectPage(1);
		this.title = 'Patients';
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.sortable) {
			for (const column of this.model.header) {
				column.sortable = changes.sortable.currentValue;
			}
		}
	}

	customSort(data) {
		data.sort((a , b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
	}

	simpleSort(index: number) {
		sort(this.model, index);
	}

	assignCopy() {
		this.filteredItems = Object.assign([], this.data);
	}

	filterItem(value) {
		if (!value) {
			this.assignCopy();
		}
		const nameFilter = Object.assign([], this.data).filter(
			item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
		);
		const emailFilter = Object.assign([], this.data).filter(
			item => item.email.toLowerCase().indexOf(value.toLowerCase()) > -1
		);
		this.filteredItems = nameFilter.concat(emailFilter.filter(x => nameFilter.every(y => y !== x)));

		this.model.totalDataLength = this.filteredItems.length;
		this.customSort(this.filteredItems);
		this.selectPage(1);
		this.title = 'Patients';
		this.isEditing = false;
	}

	clear() {
		const searchInput = this.elementRef.nativeElement.querySelector('.bx--search-input');
		if (searchInput) {
			searchInput.value = '';
		}
		this.model.totalDataLength = this.data.length;
		this.customSort(this.data);
		this.selectPage(1);
	}

	// TODO: Clear the selected surgeon when they are deleted from input
	onSelect(event, data) {
		data.forEach(surgeon => {
			surgeon.selected = false;
			if (surgeon.content === event.item.content) {
				surgeon.selected = true;
			}
		});
	}

	selected(event, data) {
		this.onSelect(event, data.surgeons);
	}

	newPatientSelected(event) {
		this.newSurgeons = this.surgeons.map(a => Object.assign({}, a));
		this.onSelect(event, this.newSurgeons);

		setTimeout(() => {
			const textFields = Array.from<HTMLElement>(this.elementRef.nativeElement.querySelectorAll('.bx--text-input__field-wrapper'));
			const temp = textFields.every(field => field.querySelector('input').value !== '') && !(this.angForm.pristine || this.angForm.invalid);
			this.disabledAdd = !temp;
		});
	}

	assignDefaults(data) {
		this.nameText = data.name;
		this.emailText = data.email;
	}

	@HostListener('focusout',  ['$event'])
	onFocousout(event) {
		const dropdown = this.elementRef.nativeElement.querySelector('.bx--combo-box');

		if (this.title === 'New Surgeon' && dropdown.contains(event.target)) {
			this.dropdownTouched = true;
		}
	}

	@HostListener('keyup',  ['$event'])
	onKeyup(event) {
		const textFields = Array.from<HTMLElement>(this.elementRef.nativeElement.querySelectorAll('.bx--text-input__field-wrapper'));
		if (textFields.some(field => field.contains(event.target))) {
			const temp = textFields.every(field => field.querySelector('input').value !== '') && !(this.angForm.pristine || this.angForm.invalid);
			this.disabledAdd = !temp;
		}
	}

	@HostListener('click',  ['$event'])
	onClick(event) {
		const expandedButtons = Array.from<HTMLElement>(this.elementRef.nativeElement.querySelectorAll('.bx--table-expand__button'));
		const expandedRow = this.elementRef.nativeElement.querySelector('.bx--expandable-row');

		if (expandedButtons.length > 0 && expandedButtons.some(button => button.contains(event.target))) {
			if (expandedRow) {
				this.title = expandedRow.children[1].innerText;
				this.isEditing = true;

				this.angForm.reset();
				this.angForm.controls['name'].setValue(this.nameText);
				this.angForm.controls['name'].updateValueAndValidity();

				this.angForm.controls['email'].setValue(this.emailText);
				this.angForm.controls['email'].updateValueAndValidity();
			} else {
				this.title = 'Patients';
				this.isEditing = false;
			}
		}
	}
}
