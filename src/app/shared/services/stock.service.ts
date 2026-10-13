import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { NotifyHandler } from '../utilities/notify.handler';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { LoaderHandler } from '../utilities/loader.handler';
import DevExpress from 'devextreme';
import CustomStore = DevExpress.data.CustomStore;
import { catchError } from 'rxjs/operators';

@Injectable()
export class StockService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}


	public getProductStocksByProductId(id: number): CustomStore {
		let token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/Stock/get-stocks-by-product-id/' + id,
			onBeforeSend: function (method, ajaxOptions) {
				ajaxOptions.headers = { 'Authorization': 'Bearer ' + token };
			}
		});
	}

	public getProductStockAdjustmentsByProductId(id: number): CustomStore {
		let token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/Stock/get-stock-adjustments-by-product-id/' + id,
			onBeforeSend: function (method, ajaxOptions) {
				ajaxOptions.headers = { 'Authorization': 'Bearer ' + token };
			}
		});
	}

	public getAvailableStockQtyBySupplierId(supplierId: number,productId: number) {
		return this.http.get<number>(this.apiUrl + '/Stock/' + `${productId}/${supplierId}`)
			.pipe(catchError(e => this.handleError(e, 'Getting available stock quantity by supplier id and  product id')));
	}
}

