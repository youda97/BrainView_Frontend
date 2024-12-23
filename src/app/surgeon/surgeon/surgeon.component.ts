import {
	Component,
	OnInit,
	Input,
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
// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../../_helpers/must-match.validator';
import { UserService } from '../../_services/user.service';
import { DataService } from '../../_services/data.service';

function sort(model, index: number) {
	if (model.header[index].sorted) {
		// if already sorted flip sorting direction
		model.header[index].ascending = model.header[index].descending;
	}
	model.sort(index);
}

@Component({
	selector: 'app-surgeon',
	templateUrl: './surgeon.component.html',
	styleUrls: ['./surgeon.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SurgeonComponent implements OnInit, OnChanges {
	model = new TableModel();
	fakeModel = new TableModel();

	newPatients = [];
	selectedList = [];
	patients = [];
	data = [];
	filteredItems = [];
	sortable = true;
	title = 'Surgeons';
	totalDataLength = 50;
	isEditing = false;

	disabledAdd = true;
	dropdownTouched = false;
	angForm: FormGroup;

	firstNameText = '';
	lastNameText = '';
	emailText = '';
	passwordText = '';

	selectedEmail = '';
	modalType = 'danger';
	modalContent = 'Are you sure you want to remove this surgeon?';
	buttons = [{
			text: 'Cancel',
			type: 'secondary'
		}, {
			text: 'Delete',
			type: 'danger',
			click: () => this.delete()
	}] as Array<ModalButton>;

	@ViewChild('deleteTemplate', null)
	protected deleteTemplate: TemplateRef<any>;
	@ViewChild('dropdownTemplate', null)
	protected dropdownTemplate: TemplateRef<any>;
	@ViewChild('passwordTemplate', null)
	protected passwordTemplate: TemplateRef<any>;
	@ViewChild('expandedTemplate', null)
	protected expandedTemplate: TemplateRef<any>;

	constructor(
		protected elementRef: ElementRef,
		protected modalService: ModalService,
		protected fb: FormBuilder,
		protected userService: UserService,
		protected dataService: DataService) {
		this.createForm();
	}

	get invalidFirstName() {
		if (this.angForm.controls['firstName'].invalid &&
			(this.angForm.controls['firstName'].dirty || this.angForm.controls['firstName'].touched)) {
			return true;
		}
		return false;
	}

	get invalidLastName() {
		if (this.angForm.controls['lastName'].invalid &&
			(this.angForm.controls['lastName'].dirty || this.angForm.controls['lastName'].touched)) {
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

	get invalidPassword() {
		if (this.angForm.controls['password'].invalid &&
			(this.angForm.controls['password'].dirty || this.angForm.controls['password'].touched)) {
			return true;
		}
		return false;
	}

	get invalidConfirmPasswordAdd() {
		if (this.angForm.controls['confirmPassword'].invalid &&
			(this.angForm.controls['confirmPassword'].dirty || this.angForm.controls['confirmPassword'].touched)) {
			return true;
		}
		return false;
	}

	get invalidConfirmPasswordEdit() {
		if (this.angForm.controls['confirmPassword'].invalid) {
			return true;
		}
		return false;
	}

	get invalidPatient() {
		if (this.dropdownTouched && !this.newPatients.some(patient => patient.selected)) {
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
				data: 'First Name'
			}),
			new TableHeaderItem({
				data: 'Last Name'
			}),
			new TableHeaderItem({
				data: 'Email'
			}),
			new TableHeaderItem({
				data: 'Actions',
				sortable: false
			})
		];

		this.userService.getAdminBoard('/neurosurgeon', 'json').subscribe(
			resp => {
				console.log('model ', resp);
				resp.surgeons.forEach(surgeon => {
					this.data.push({
						email: surgeon.username,
						firstName: surgeon.firstName,
						lastName: surgeon.lastName
					});
				});

				this.model.pageLength = 10;
				this.model.totalDataLength = this.data.length;
				this.customSort(this.data);
				this.selectPage(1);
			},
			err => {
				console.log(err);
			}
		);
	}

	createForm() {
		this.angForm = this.fb.group({
			firstName: ['', Validators.required ],
			lastName: ['', Validators.required ],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword: ['', Validators.required]
		}, {
			validator: MustMatch('password', 'confirmPassword')
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
				new TableItem({ data: datum.firstName }),
				new TableItem({ data: datum.lastName }),
				new TableItem({ data: datum.email }),
				new TableItem({template: this.deleteTemplate})
			]);
		}
		return newData;
	}

	addNewSurgeon() {
		this.title = 'New Surgeon';
		this.disabledAdd = true;
		this.angForm.reset();
	}

	back() {
		this.title = 'Surgeons';
		this.disabledAdd = true;
		this.angForm.reset();
	}

	save(data, event) {
		this.data.forEach(element => {
			if (element.email === data.email) {
				element.firstName = event.target.closest('form').children[0].querySelector('input').value;
				element.lastName = event.target.closest('form').children[1].querySelector('input').value;
				element.email = event.target.closest('form').children[2].querySelector('input').value;
				element.password = event.target.closest('form').children[3].querySelector('input').value;

				const index = this.data.findIndex(x => x.email === element.email);
				const page = Math.floor(index / this.model.pageLength) + 1;
				this.selectPage(page);
				this.title = 'Surgeons';
				this.isEditing = false;
			}
		});
		this.angForm.reset();
	}

	openModal(event) {
		this.selectedEmail = event.target.closest('tr').children[2].innerText;
		this.modalService.show({
			modalType: this.modalType,
			title: 'Deleting ' + this.selectedEmail,
			content: this.modalContent,
			buttons: this.buttons
		});
	}

	delete() {
		this.dataService.deleteSurgeon(this.selectedEmail).subscribe(
			() => {
				const index = this.data.findIndex(x => x.email === this.selectedEmail);
				this.data.splice(index, 1);
				this.model.totalDataLength = this.data.length;
				const page = Math.floor(index / this.model.pageLength) + 1;
				this.selectPage(page);
			},
			err => {
				console.log(err);
			}
		);
	}

	add() {
		const item = {
			firstName: this.elementRef.nativeElement.querySelector('[name=\'firstName\']').value,
			lastName: this.elementRef.nativeElement.querySelector('[name=\'lastName\']').value,
			email: this.elementRef.nativeElement.querySelector('[name=\'email\']').value,
		};

		this.dataService.addSurgeon(this.angForm.value).subscribe(
			() => {
				this.data.push(item);
				this.model.totalDataLength = this.data.length;
				this.customSort(this.data);
				this.selectPage(1);
			},
			err => {
				console.log(err);
			}
		);
		this.title = 'Surgeons';
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
		const firstNameFilter = Object.assign([], this.data).filter(
			item => item.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1
		);
		const lastNameFilter = Object.assign([], this.data).filter(
			item => item.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1
		);
		const emailFilter = Object.assign([], this.data).filter(
			item => item.email.toLowerCase().indexOf(value.toLowerCase()) > -1
		);
		const temp = firstNameFilter.concat(lastNameFilter.filter(x => firstNameFilter.every(y => y !== x)));
		this.filteredItems = temp.concat(emailFilter.filter(x => temp.every(y => y !== x)));
		this.model.totalDataLength = this.filteredItems.length;
		this.customSort(this.filteredItems);
		this.selectPage(1);
		this.title = 'Surgeons';
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

	getUnique(array) {
		const result = array.reduce((unique, o) => {
			if (!unique.some(obj => obj.content === o.content)) {
				unique.push(o);
			}
			return unique;
		}, []);
		return result;
	}

	onSelected(event, data) {
		event.forEach(patientElem => {
			this.selectedList.push(patientElem);
		});

		const filtered = this.getUnique(this.selectedList).filter(value => {
			return event.some(a => a.content === value.content);
		});
		this.selectedList = filtered.map(a => Object.assign({}, a));

		if (this.selectedList.length === 0) {
			return;
		}
		data.forEach(patient => {
			if (this.selectedList.some(item => item.content === patient.content)) {
				patient.selected = true;
			} else {
				patient.selected = false;
			}
		});
	}

	selected(event, data) {
		this.onSelected(event, data.patients);
	}

	assignDefaults(data) {
		this.firstNameText = data.firstName;
		this.lastNameText = data.lastName;
		this.emailText = data.email;
		this.passwordText = data.password;
	}

	@HostListener('keyup',  ['$event'])
	onKeyup(event) {
		const textFields = Array.from<HTMLElement>(
			this.elementRef.nativeElement.querySelectorAll('.bx--text-input__field-wrapper:not(.combobox)'));
		if (textFields.some(field => field.contains(event.target))) {
			this.disabledAdd =
				!(textFields.every(field => field.querySelector('input').value !== '') &&
				!(this.angForm.pristine || this.angForm.invalid));
		}
	}

	@HostListener('click',  ['$event'])
	onClick(event) {
		const expandedButtons = Array.from<HTMLElement>(this.elementRef.nativeElement.querySelectorAll('.bx--table-expand__button'));
		const expandedRow = this.elementRef.nativeElement.querySelector('.bx--expandable-row');
		const dropdowns = Array.from<HTMLElement>(this.elementRef.nativeElement.querySelectorAll('.bx--list-box__field'));
		const checkboxes = Array.from<HTMLElement>(this.elementRef.nativeElement.querySelectorAll('.bx--checkbox-label'));

		if (dropdowns.some(dropdown => dropdown.contains(event.target)) &&
			checkboxes.every(checkbox => checkbox.getAttribute('data-contained-checkbox-state') === 'false')) {
			this.selectedList = [];
		}

		if (expandedButtons.length > 0 && expandedButtons.some(button => button.contains(event.target))) {
			if (expandedRow) {
				this.title = expandedRow.children[1].innerText;
				this.isEditing = true;

				this.angForm.reset();
				this.angForm.controls['firstName'].setValue(this.firstNameText);
				this.angForm.controls['firstName'].updateValueAndValidity();

				this.angForm.controls['lastName'].setValue(this.lastNameText);
				this.angForm.controls['lastName'].updateValueAndValidity();

				this.angForm.controls['email'].setValue(this.emailText);
				this.angForm.controls['email'].updateValueAndValidity();

				this.angForm.controls['password'].setValue(this.passwordText);
				this.angForm.controls['password'].updateValueAndValidity();

				this.angForm.controls['confirmPassword'].setValue(this.passwordText);
				this.angForm.controls['confirmPassword'].updateValueAndValidity();
			} else {
				this.title = 'Surgeons';
				this.isEditing = false;
			}
		}
	}
}
