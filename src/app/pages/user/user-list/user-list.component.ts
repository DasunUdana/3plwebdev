import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { SupplierService } from 'src/app/shared/services/supplier.service';
import { AuthService } from '../../../shared/services';
import CustomStore from 'devextreme/data/custom_store';
import { confirm } from 'devextreme/ui/dialog';
import { LoaderHandler } from '../../../shared/utilities/loader.handler';
import { NotifyHandler } from '../../../shared/utilities/notify.handler';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';


@Component({
	templateUrl: 'user-list.component.html',
	styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {

	@ViewChild('grid') grid: DxDataGridComponent;
	@ViewChild('resetPasswordForm') resetPasswordForm: DxFormComponent;

	userStore: CustomStore;

	resetPasswordPopupVisible = false;
	resetPasswordFormData = {
		id: 0,
		userName: null,
		password: null,
		confirmationPassword: null
	};

	constructor(
		private authService: AuthService,
		private router: Router,
		private loader: LoaderHandler,
		private notify: NotifyHandler
	) {
		this.deleteUser = this.deleteUser.bind(this);
		this.setUserStatus = this.setUserStatus.bind(this);
		this.editUser = this.editUser.bind(this);
		this.resetPassword = this.resetPassword.bind(this);
	}


	ngOnInit(): void {
		this.userStore = this.authService.getUsers();
	}

	openUser(id: number) {
		this.router.navigate(['/user/' + id]);
	}

	public passwordComparison = () => {
		return this.resetPasswordForm.instance.option('formData').password;
	}

	public deleteUser(e: any): void {
		e.event.preventDefault();
		const result = confirm('<i>Are you sure you want to delete this user?</i>', 'Delete User');
		result.then((dialogResult) => {
			if (dialogResult) {
				this.loader.show(true);
				this.authService.deleteUser(e.row.data.id).subscribe(() => {
					this.notify.success('Successfully user deleted');
					this.grid.instance.refresh();
					this.loader.show(false);
				});
			}
		});
	}

	public isActiveButtonVisible(e): boolean {
		return !e.row.data.active;
	}

	public isDeactivateButtonVisible(e): boolean {
		return e.row.data.active;
	}

	public setUserStatus(e: any): void {
		e.event.preventDefault();

		const active: boolean = e.row.data.active;
		let message: string;

		if (active) {
			message = 'Are you sure you want to disable this user?';
		}else {
			message = 'Are you sure you want to enable this user?';
		}

		const result = confirm(`<i>${message}</i>`, 'Change User Status');

		result.then((dialogResult) => {
			if (dialogResult) {
				this.loader.show(true);
				this.authService.setStatus(e.row.data.id, !active).subscribe(() => {
					this.notify.success('Successfully update user status');
					this.grid.instance.refresh();
					this.loader.show(false);
				});
			}
		});

	}

	public editUser(e: any): void {
		this.router.navigate(['/user/' + e.row.data.id]);
	}

	public resetPassword(e: any): void {
		if (this.resetPasswordForm) {
			this.resetPasswordForm.instance.resetValues();
		}
		this.resetPasswordFormData.id = e.row.data.id;
		this.resetPasswordFormData.userName = e.row.data.userName;
		this.resetPasswordPopupVisible = true;
	}

	handleResetPasswordForm(e) {
		e.preventDefault();
		const data = this.resetPasswordForm.instance.option('formData');
		this.resetPasswordPopupVisible = false;
		this.loader.show(true);
		this.authService.resetPassword(data.id, data.password, data.confirmationPassword).subscribe(() => {
			this.loader.show(false);
			this.notify.success('Successfully reset the password');
		});
	}

}

