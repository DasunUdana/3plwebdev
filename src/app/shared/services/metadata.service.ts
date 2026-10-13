import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base.service';
import { NotifyHandler } from '../utilities/notify.handler';
import { Router } from '@angular/router';

import { catchError } from 'rxjs/operators';
import { IMetaData } from '../models/metadata';
import { LoaderHandler } from '../utilities/loader.handler';

@Injectable()
export class MetadataService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}

	public getMetadata(): Promise<IMetaData> {
		return this.http.get<IMetaData>(this.apiUrl + `/metadata`)
			.pipe(catchError(e => this.handleError(e, 'Getting metadata'))).toPromise();
	}

}

