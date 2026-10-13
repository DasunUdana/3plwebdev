import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { NotifyHandler } from '../utilities/notify.handler';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { catchError } from 'rxjs/operators';
import { IGrn } from '../models/grn';
import { LoaderHandler } from '../utilities/loader.handler';
import DevExpress from 'devextreme';
import CustomStore = DevExpress.data.CustomStore;

@Injectable()
export class GrnService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}


	public addGrn(grn: IGrn) {
		return this.http.post(this.apiUrl + '/Grn', grn)
			.pipe(catchError(e => this.handleError(e, 'Create grn')));
	}

	public getById(id: number) {
		return this.http.get<IGrn>(this.apiUrl + `/Grn/${id}`)
			.pipe(catchError(e => this.handleError(e, 'Get grn')));
	}

	public getGrns(): CustomStore {
		let token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/grn',
			onBeforeSend: function (method, ajaxOptions) {
				ajaxOptions.headers = { 'Authorization': 'Bearer ' + token };
			}
		});
	}

}

