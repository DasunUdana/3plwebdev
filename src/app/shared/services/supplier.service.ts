import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

import { BaseService } from './base.service';
import { ICreateAccount, ISupplier, ISupplierStorage } from '../../shared/models/supplier';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import { NotifyHandler } from '../utilities/notify.handler';
import { Router } from '@angular/router';
import { LoaderHandler } from '../utilities/loader.handler';


@Injectable()
export class SupplierService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}

	public getSuppliers() {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/Supplier',
			onBeforeSend(method, ajaxOptions) {
				ajaxOptions.headers = { Authorization: 'Bearer ' + token };
			}
		});
	}

	public getSupplierById(id: number) {
		return this.http.get<ISupplier>(this.apiUrl + '/Supplier/' + id)
			.pipe(catchError(e => this.handleError(e, 'Getting Supplier by Id')));
	}

	public updateSupplier(supplier: ISupplier) {
		return this.http.put<any>(this.apiUrl + '/Supplier/', supplier)
			.pipe(catchError(e => this.handleError(e, 'Updating supplier')));
	}

	public addSupplier(supplier: ISupplier) {
		return this.http.post<any>(this.apiUrl + '/Supplier/', supplier)
			.pipe(catchError(e => this.handleError(e, 'Adding supplier')));
	}

	public createAccount(account: ICreateAccount) {
		return this.http.post<any>(this.apiUrl + '/Supplier/create-account', account)
			.pipe(catchError(e => this.handleError(e, 'Create account')));
	}

	public getSupplierStorageDetails(id: number) {
		return this.http.get<ISupplierStorage>(this.apiUrl + `/Supplier/storage-details/${id}`)
			.pipe(catchError(e => this.handleError(e, 'Supplier storage details')));
	}

}

