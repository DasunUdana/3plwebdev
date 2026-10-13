import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxListModule } from 'devextreme-angular/ui/list';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { IUser } from '../../models/user';

@Component({
	selector: 'app-user-panel',
	templateUrl: 'user-panel.component.html',
	styleUrls: ['./user-panel.component.scss']
})

export class UserPanelComponent {
	@Input()
	menuItems: any;

	@Input()
	menuMode: string;

	@Input()
	user: IUser;

	constructor() {
	}
}

@NgModule({
	imports: [
		DxListModule,
		DxContextMenuModule,
		CommonModule
	],
	declarations: [UserPanelComponent],
	exports: [UserPanelComponent]
})
export class UserPanelModule {
}
