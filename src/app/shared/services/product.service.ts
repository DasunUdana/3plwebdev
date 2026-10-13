import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { NotifyHandler } from '../utilities/notify.handler';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { catchError } from 'rxjs/operators';
import { IProduct } from '../models/product';
import { LoaderHandler } from '../utilities/loader.handler';

@Injectable()
export class ProductService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}

	public getProducts() {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/Product',
			onBeforeSend(method, ajaxOptions) {
				ajaxOptions.headers = { Authorization: 'Bearer ' + token };
			}
		});
	}

	public getProductsWithCode() {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/Product/withProductCode',
			onBeforeSend(method, ajaxOptions) {
				ajaxOptions.headers = { Authorization: 'Bearer ' + token };
			}
		});
	}
	
	public getProductById(id: number) {
		return this.http.get<IProduct>(this.apiUrl + '/Product/' + id)
			.pipe(catchError(e => this.handleError(e, 'Getting Product by Id')));
	}

	public createProduct(product: IProduct) {
		return this.http.post<IProduct>(this.apiUrl + '/Product', product)
			.pipe(catchError(e => this.handleError(e, 'Creating product')));
	}

	public updateProduct(product: IProduct) {
		return this.http.put<IProduct>(this.apiUrl + '/Product', product)
			.pipe(catchError(e => this.handleError(e, 'Update product')));
	}

}

