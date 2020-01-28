import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SurgeonRoutingModule } from './surgeon-routing.module';
import { SurgeonComponent } from './surgeon/surgeon.component';

import {
    TableModule,
	PaginationModule,
	SearchModule,
	ButtonModule,
	InputModule,
	ModalModule,
    ComboBoxModule
} from 'carbon-components-angular';

import { Add20Module } from '@carbon/icons-angular/lib/add/20';
import { Delete20Module } from '@carbon/icons-angular/lib/delete/20';
import { Save20Module } from '@carbon/icons-angular/lib/save/20';

@NgModule({
	declarations: [SurgeonComponent],
	imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
		SurgeonRoutingModule,
        TableModule,
        PaginationModule,
        SearchModule,
        ButtonModule,
        InputModule,
        ModalModule,
        ComboBoxModule,
        Add20Module,
        Delete20Module,
        Save20Module
	]
})
export class SurgeonModule { }
