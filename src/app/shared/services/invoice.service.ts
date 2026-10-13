import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { NotifyHandler } from '../utilities/notify.handler';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { catchError } from 'rxjs/operators';
import { LoaderHandler } from '../utilities/loader.handler';
import { IInvoice, IInvoiceItem } from '../models/invoice';

@Injectable()
export class InvoiceService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}

	public getInvoices() {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/Invoice',
			onBeforeSend(method, ajaxOptions) {
				ajaxOptions.headers = { Authorization: 'Bearer ' + token };
			}
		});
	}

	public getInvoiceById(id: number) {
		return this.http.get<IInvoice>(this.apiUrl + '/Invoice/' + id)
			.pipe(catchError(e => this.handleError(e, 'Getting invoice by Id')));
	}

	public markAsPaid(id: number) {
		return this.http.post(this.apiUrl + '/Invoice/mark-as-paid', { id })
			.pipe(catchError(e => this.handleError(e, 'Mark as paid')));
	}

	public updateInvoice(id: number, invoiceItems: IInvoiceItem[]) {
		return this.http.put<IInvoice>(this.apiUrl + '/Invoice/' + id, invoiceItems)
			.pipe(catchError(e => this.handleError(e, 'Update invoice')));
	}
}

