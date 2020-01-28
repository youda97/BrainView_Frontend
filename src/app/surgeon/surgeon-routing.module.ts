import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurgeonComponent } from './surgeon/surgeon.component';

const routes: Routes = [{
	path: '',
	component: SurgeonComponent
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SurgeonRoutingModule { }
