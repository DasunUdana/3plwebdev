import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { IWarehouse, IWareHouseStorageInfo } from '../../shared/models/warehouse';
import { Router } from '@angular/router';
import { NotifyHandler } from '../utilities/notify.handler';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoaderHandler } from '../utilities/loader.handler';
import { Observable } from 'rxjs';

@Injectable()
export class WarehouseService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}

	public getWarehouses() {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/WareHouse',
			onBeforeSend(method, ajaxOptions) {
				ajaxOptions.headers = { Authorization: 'Bearer ' + token };
			}
		});
	}

	public getWarehouseById(id: number) {
		return this.http.get<IWarehouse>(this.apiUrl + '/WareHouse/' + id)
			.pipe(catchError(e => this.handleError(e, 'Getting Warehouse by Id')));
	}

	public addWarehouse(wareHouse: IWarehouse) {
		return this.http.post<IWarehouse>(this.apiUrl + '/WareHouse/', wareHouse)
			.pipe(catchError(e => this.handleError(e, 'Adding warehouse')));
	}

	public updateWarehouse(wareHouse: IWarehouse) {
		return this.http.put<IWarehouse>(this.apiUrl + '/WareHouse/', wareHouse)
			.pipe(catchError(e => this.handleError(e, 'Adding warehouse')));
	}

	public getWareHouseStorageInfo(): Observable<IWareHouseStorageInfo[]> {
		return this.http.get<IWareHouseStorageInfo[]>(this.apiUrl + '/WareHouse/warehouse-storage-info')
			.pipe(catchError(e => this.handleError(e, 'Getting warehouse storage details')));
	}
}

