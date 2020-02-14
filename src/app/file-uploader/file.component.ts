import {
	Component,
	Input,
	Output,
	EventEmitter,
	HostBinding,
	ViewEncapsulation
} from "@angular/core";

import { I18n } from "carbon-components-angular";
import { FileItem } from "./file-item.interface";

@Component({
	selector: "ibm-file",
	template: `
		<p class="bx--file-filename">{{fileItem.file.name}}</p>
		<div class="bx--download">
			<span style="cursor: pointer" (click)="download.emit()">download</span>
		</div>
		<span
			*ngIf="fileItem.state === 'edit'"
			class="bx--file__state-container"
			(click)="remove.emit()"
			(keyup.enter)="remove.emit()"
			(keyup.space)="remove.emit()"
			tabindex="0">
			<ibm-icon-warning-filled16
				*ngIf="isInvalidText"
				class="bx--file--invalid">
			</ibm-icon-warning-filled16>
			<ibm-icon-close16
				class="bx--file-close"
				[ariaLabel]="translations.REMOVE_BUTTON">
			</ibm-icon-close16>
		</span>
		<span *ngIf="fileItem.state === 'upload'">
			<div class="bx--inline-loading__animation">
				<ibm-loading size="sm"></ibm-loading>
			</div>
		</span>
		<span
			*ngIf="fileItem.state === 'complete'"
			class="bx--file__state-container"
			tabindex="0">
			<ibm-icon-checkmark-filled16
				class="bx--file-complete"
				[ariaLabel]="translations.CHECKMARK">
			</ibm-icon-checkmark-filled16>
		</span>
	`,
	styles: [`
		.bx--file__selected-file {
			margin-top: 20px;
			background-color: #f4f4f4; 
		}

		.bx--file__selected-file--invalid {
			outline-width: 2px;
			padding: 0px;
		}

		.bx--file__selected-file--invalid + .bx--form-requirement {
			padding: 0px;
		}

		.bx--file__state-container {
			align-items: center;
		}

		.bx--file--invalid {
			height: 1rem;
			width: 1rem;
		}

		.bx--file__selected-file {
			grid-template-columns: 1fr 1fr auto;
			grid-gap: 0;
		}
		
		.bx--download {
			padding-right: 10px;
			text-align: right;
			font-size: 0.875rem;
			font-weight: 400;
			line-height: 1.125rem;
			letter-spacing: 0.16px;
			color: #0f62fe;
		}

		.bx--file__state-container .bx--file-close {
			margin-left: auto;
			float: right;
		}
	`],
	encapsulation: ViewEncapsulation.None
})
export class FileComponent {
	/**
	 * Accessible translations for the close and complete icons
	 */
	@Input() translations = this.i18n.get().FILE_UPLOADER;
	/**
	 * A single `FileItem` from the set of `FileItem`s
	 */
	@Input() fileItem: FileItem;

	@Output() download = new EventEmitter();

	@Output() remove = new EventEmitter();

	@HostBinding("class.bx--file__selected-file") selectedFile = true;

	@HostBinding("class.bx--file__selected-file--invalid") get isInvalidText() {
		return this.fileItem.invalidText;
	}

	constructor(protected i18n: I18n) {}
}

// compatibility export
// TODO: remove in v4
// tslint:disable-next-line: variable-name
export const File = FileComponent;
