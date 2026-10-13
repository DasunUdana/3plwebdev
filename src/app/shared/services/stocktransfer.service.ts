import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { NotifyHandler } from '../utilities/notify.handler';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoaderHandler } from '../utilities/loader.handler';
import { IProductStockTransfer, IStockTransfer } from '../models/stockTransfer';

@Injectable()
export class StockTransferService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}

	public getStockTransfers() {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/StockTransfer',
			onBeforeSend(method, ajaxOptions) {
				ajaxOptions.headers = { Authorization: 'Bearer ' + token };
			}
		});
	}

	public getStockTransferById(id: number): Observable<IStockTransfer> {
		return this.http.get<IStockTransfer>(this.apiUrl + '/StockTransfer/get-stock-transfer/' + id)
			.pipe(catchError(e => this.handleError(e, 'Getting stock transfer by id')));
	}

	public addStckTransfer(stockTransfer: IStockTransfer) {
		return this.http.post(this.apiUrl + '/StockTransfer', stockTransfer)
			.pipe(catchError(e => this.handleError(e, 'Create stock transfer')));
	}

	public transferStock(returnStock: IProductStockTransfer) {
		return this.http.post(this.apiUrl + '/Stock/transfer-stock', returnStock)
			.pipe(catchError(e => this.handleError(e, 'Transfer Return Stock')));
	}
}

