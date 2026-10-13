import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import { NotifyHandler } from '../utilities/notify.handler';
import { LoaderHandler } from '../utilities/loader.handler';


@Injectable()
export class BaseService {
	public apiUrl: string = location.host.toLocaleLowerCase().includes('.local') ?
		environment.localApiUrl : environment.apiUrl;

	constructor(
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
	}

	public handleError(error: any, operation?: string, hideToastr?: boolean) {

		// if unauthorized error clear cache & redirect to login
		if ( error.status === 401 ) {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			this.notify.error('Session expired. Please login to visit this page');
			this.router.navigateByUrl('/login-form');

		} else {
			// display error message
			if ( ! hideToastr ) {
				if ( ! error.error || ! error.error.errors ) {
					this.notify.error('Sorry an error occurred. ' + (operation ? operation + ' failed.' : ''));
				} else {
					error.error.errors.map(err => {
						this.notify.error(err.message);
					});
				}
				this.loader.show(false);
			}

			// return error
			return throwError(error.error);
		}
	}

}
