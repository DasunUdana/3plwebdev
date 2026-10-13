import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { NotifyHandler } from '../utilities/notify.handler';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { catchError } from 'rxjs/operators';
import { ICalculateStorage, ICalculateStorageResponse, IPurchaseOrder } from '../models/purchaseOrder';
import { Observable } from 'rxjs';
import { LoaderHandler } from '../utilities/loader.handler';

@Injectable()
export class PurchaseOrderService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}

	public getPurchaseOrders() {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/PurchaseOrder',
			onBeforeSend(method, ajaxOptions) {
				ajaxOptions.headers = { Authorization: 'Bearer ' + token };
			}
		});
	}

	public getPurchaseOrderById(id: number): Observable<IPurchaseOrder> {
		return this.http.get<IPurchaseOrder>(this.apiUrl + '/PurchaseOrder/get-by-id/' + id)
			.pipe(catchError(e => this.handleError(e, 'Getting purchase order by Id')));
	}

	public addPurchaseOrder(purchaseOrder: IPurchaseOrder) {
		return this.http.post(this.apiUrl + '/PurchaseOrder', purchaseOrder)
			.pipe(catchError(e => this.handleError(e, 'Create purchase order')));
	}

	public updatePurchaseOrder(purchaseOrder: IPurchaseOrder) {
		return this.http.put(this.apiUrl + '/PurchaseOrder', purchaseOrder)
			.pipe(catchError(e => this.handleError(e, 'Update purchase order')));
	}

	public calculateStorage(calculateStorage: ICalculateStorage) {
		return this.http.post<ICalculateStorageResponse>(this.apiUrl + '/PurchaseOrder/calculate-storage',
				calculateStorage)
			.pipe(catchError(e => this.handleError(e, 'Calculate storage')));
	}

	public markAsPrinted(id: number) {
		return this.http.post(this.apiUrl + '/PurchaseOrder/mark-as-printed/' + id, {})
			.pipe(catchError(e => this.handleError(e, 'Mark as printed')));
	}
}

