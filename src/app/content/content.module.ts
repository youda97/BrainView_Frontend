import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content/content.component';

import { GridModule, TilesModule } from 'carbon-components-angular';


@NgModule({
	declarations: [ContentComponent],
	imports: [
		CommonModule,
		ContentRoutingModule,
		GridModule,
		TilesModule
	]
})
export class ContentModule { }
