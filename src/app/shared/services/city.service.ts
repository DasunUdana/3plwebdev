import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

import { BaseService } from './base.service';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import { NotifyHandler } from '../utilities/notify.handler';
import { Router } from '@angular/router';
import DevExpress from 'devextreme';
import { ICity } from '../models/city';
import { catchError } from 'rxjs/operators';
import { LoaderHandler } from '../utilities/loader.handler';
import CustomStore = DevExpress.data.CustomStore;

@Injectable()
export class CityService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}

	public getCities(): CustomStore {
		let token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/City',
			onBeforeSend: function (method, ajaxOptions) {
				ajaxOptions.headers = { 'Authorization': 'Bearer ' + token };
			}
		});
	}

	public getCityById(id: number) {
		return this.http.get<ICity>(this.apiUrl + `/city/get/${id}`)
			.pipe(catchError(e => this.handleError(e, 'Getting City by Id')));
	}

}

