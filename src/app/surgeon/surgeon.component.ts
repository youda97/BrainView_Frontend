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
	@ViewChild('expandedTemplate', null)
	protected expandedTemplate: TemplateRef<any>;

	constructor(protected elementRef: ElementRef, protected modalService: ModalService) { }

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
				data: 'Password',
			}),
			new TableHeaderItem({
				data: 'Patients',
				sortable: false
			}),
			new TableHeaderItem({
				data: 'Actions',
				sortable: false
			})
		];

		for (let i = 0; i < 10; i++) {
			this.patients.push({
				content: 'patient name' + i,
				selected: false
			});
		}

		for (let i = 0; i < 50; i++) {
			const newPatients = this.patients.map(a => Object.assign({}, a));
			this.data.push({
				name: 'name ' + i,
				email: 'email' + i + '@uwo.ca',
				password: 'pass',
				patients: newPatients
			});
		}

		this.model.pageLength = 10;
		this.model.totalDataLength = this.data.length;
		this.customSort(this.data);
		this.selectPage(1);
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
					expandedData: { name: datum.name, email: datum.email, password: datum.password },
					expandedTemplate: this.expandedTemplate
				}),
				new TableItem({ data: datum.email }),
				new TableItem({ data: datum.password }),
				new TableItem({data: datum, template: this.dropdownTemplate}),
				new TableItem({template: this.deleteTemplate})
			]);
		}
		return newData;
	}

	addNewSurgeon() {
		this.title = 'New Surgeon';
	}

	back() {
		this.title = 'Surgeons';
	}

	save(data, event) {
		this.data.forEach(element => {
			if (element.email === data.email) {
				element.name = event.target.closest('form').children[0].querySelector('input').value;
				element.email = event.target.closest('form').children[1].querySelector('input').value;
				element.password = event.target.closest('form').children[2].querySelector('input').value;

				const index = this.data.findIndex(x => x.email === element.email);
				const page = Math.floor(index / this.model.pageLength) + 1;
				this.selectPage(page);
				this.title = 'Surgeons';
				this.isEditing = false;
			}
		});
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
			password: this.elementRef.nativeElement.querySelector('[name=\'password\']').value,
			patients: this.newPatients
		};

		this.data.push(item);
		this.model.totalDataLength = this.data.length;
		this.customSort(this.data);
		this.selectPage(1);
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

	// TODO: Remove selected patients from other dropdowns
	// and add them back when they unselected
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

	newSurgeonSelected(event) {
		this.newPatients = this.patients.map(a => Object.assign({}, a));
		this.onSelected(event, this.newPatients);
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
			} else {
				this.title = 'Surgeons';
				this.isEditing = false;
			}
		}
	}
}
