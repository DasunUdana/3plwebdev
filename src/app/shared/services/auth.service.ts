import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ACCESS_TOKEN_KEY, CURRENT_USER_KEY, ROLE_KEY } from '../constants/common';
import { ILoginModel, ILoginResponseModel, IUser } from '../models/auth';
import { NotifyHandler } from '../utilities/notify.handler';
import { BaseService } from './base.service';
import { LoaderHandler } from '../utilities/loader.handler';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';

const defaultPath = '/';
const defaultUser = {
	email: 'sandra@example.com',
	avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png'
};

@Injectable()
export class AuthService extends BaseService {
	private _user = defaultUser;

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}

	get loggedIn(): boolean {
		const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
		return (accessToken && accessToken !== '');
	}

	get role(): string {
		return localStorage.getItem(ROLE_KEY);
	}

	get isAdmin(): boolean {
		return this.role === 'Admin';
	}

	get isSupplier(): boolean {
		return this.role === 'Supplier';
	}

	get isUser(): boolean {
		return this.role === 'User';
	}

	get isWareHouseManager(): boolean {
		return this.role === 'Warehouse Manager';
	}

	private _lastAuthenticatedPath: string = defaultPath;

	set lastAuthenticatedPath(value: string) {
		this._lastAuthenticatedPath = value;
	}

	public login(loginModel: ILoginModel) {
		return this.http.post<ILoginResponseModel>(this.apiUrl + '/Account', loginModel)
			.pipe(catchError(this.extractError));
	}

	getUser(): IUser {
		return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) as IUser;
	}

	public getUsers(): CustomStore {
		let token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/Account',
			onBeforeSend: function (method, ajaxOptions) {
				ajaxOptions.headers = { 'Authorization': 'Bearer ' + token };
			}
		});
	}

	public getSupplierUsers(supplierId: number): DataSource {
		let token = localStorage.getItem(ACCESS_TOKEN_KEY);
		var store = AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/Account',
			onBeforeSend: function (method, ajaxOptions) {
				ajaxOptions.headers = { 'Authorization': 'Bearer ' + token };
			}
		});
		return new DataSource({
			store,
			filter: ['supplierId', '=', supplierId]
		});
	}

	public getUserById(id: number) {
		return this.http.get<IUser>(this.apiUrl + '/Account/get-user/' + id)
			.pipe(catchError(e => this.handleError(e, 'Getting user by Id')));
	}

	public createUser(user: IUser, password: string) {
		return this.http.post<IUser>(this.apiUrl + '/Account/create-user',
			{ ...user, password, confirmationPassword: password })
			.pipe(catchError(e => this.handleError(e, 'Create user')));
	}

	public updateUser(user: IUser) {
		return this.http.post<IUser>(this.apiUrl + '/Account/update-user', user)
			.pipe(catchError(e => this.handleError(e, 'Update user')));
	}

	public deleteUser(id: number) {
		return this.http.delete(this.apiUrl + '/Account/' + id)
			.pipe(catchError(e => this.handleError(e, 'Delete user')));
	}

	public setStatus(id: number, status: boolean) {
		return this.http.post(this.apiUrl + '/Account/set-status', { id, status })
			.pipe(catchError(e => this.handleError(e, 'Set user status')));
	}

	public resetPassword(id: number, password: string, confirmationPassword: string) {
		return this.http.post(this.apiUrl + '/Account/reset-password', { id, password, confirmationPassword })
			.pipe(catchError(e => this.handleError(e, 'Reset password')));
	}

	async logOut() {
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(CURRENT_USER_KEY);
		this._user = null;
		this.router.navigate(['/login-form']);
	}

	private extractError(errorData: HttpErrorResponse) {
		let errorMessage = '';

		if ( errorData.error && errorData.error.errors ) {
			errorData.error.errors.forEach(element => {
				errorMessage = errorMessage + ' ' + element.message;
			});
			return throwError((errorMessage !== '') ? errorMessage : 'Sorry an error occurred');
		}
	}

}

@Injectable()
export class AuthGuardService implements CanActivate {
	constructor(private router: Router, private authService: AuthService) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

		const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
		if ( accessToken && accessToken !== '' ) {
			this.authService.lastAuthenticatedPath = route.routeConfig.path;
			return true;
		}

		this.router.navigate(['/login-form'], { queryParams: { returnUrl: state.url } });
		return false;
	}
}
