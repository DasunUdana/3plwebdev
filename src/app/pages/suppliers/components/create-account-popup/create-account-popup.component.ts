import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { LoaderHandler } from 'src/app/shared/utilities/loader.handler';
import { IUser } from '../../../../shared/models/auth';
import { DxFormComponent } from 'devextreme-angular';
import { ICreateAccount } from '../../../../shared/models/supplier';
import { SupplierService } from '../../../../shared/services/supplier.service';

@Component({
	selector: 'app-create-account-popup',
	templateUrl: 'create-account-popup.component.html',
	styleUrls: ['./create-account-popup.component.scss']
})
export class CreateAccountPopupComponent {

	@Input()
	visible = false;

	@Input()
	supplierId = 0;

	@Output() onSuccess = new EventEmitter();
	@Output() onCancel = new EventEmitter();

	public account: ICreateAccount;
	@ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;

	constructor(
		private supplierService: SupplierService,
		private loader: LoaderHandler,
	) {
		this.account = this.newAccount();
	}

	public createAccount(): void {
		this.loader.show(true);
		this.account.supplierId = this.supplierId;
		this.supplierService.createAccount(this.account)
			.subscribe((response: IUser) => {
				this.onSuccess.emit('success');
			});
	}

	public handleSubmit(e: Event): void {
		e.preventDefault();
		this.createAccount();
	}

	public onShowingPopup(e: Event): void {
		if (this.form) {
			this.form.instance.resetValues();
		}
	}

	public onClosePopup(e: Event): void {
		this.onCancel.emit('cancel');
	}

	public passwordComparison = () => {
		return this.form.instance.option('formData').password;
	}


	private newAccount(): ICreateAccount {
		return {
			supplierId: this.supplierId,
			username: null,
			email: null,
			active: true,
			password: null,
			confirmPassword: null
		};
	}
}

