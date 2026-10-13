import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';

import { ACCESS_TOKEN_KEY, CURRENT_USER_KEY, ROLE_KEY } from '../../constants/common';
import { ILoginModel, ILoginResponseModel } from '../../models/auth';
import { AuthService } from '../../services';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';


@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

	public loginModel: ILoginModel = { userName: '', password: '' };
	public isLoading: boolean = false;
	public errorMessage: string = '';
	private returnUrl: string = '/';

	constructor(
		private router: Router,
		private authService: AuthService,
		private activatedRoute: ActivatedRoute
	) {
	}


	ngOnInit() {
		this.activatedRoute.queryParams.subscribe(params => {
			if ( params.returnUrl ) {
				this.returnUrl = params.returnUrl;
			}
		});
		if (this.authService.loggedIn) {
			this.router.navigate([this.returnUrl]);
		}
	}


	public login(e: any) {
		e.preventDefault();
		this.isLoading = true;
		this.authService.login(this.loginModel).subscribe((data: ILoginResponseModel) => {
				localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
				localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
				localStorage.setItem(ROLE_KEY, data.roles[0]);
				this.router.navigate([this.returnUrl]);
			},
			(errorText: string) => {
				this.errorMessage = errorText;
				this.isLoading = false;
			});
	}

}

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		DxFormModule,
		DxLoadIndicatorModule,
		DxScrollViewModule
	],
	declarations: [LoginFormComponent],
	exports: [LoginFormComponent]
})
export class LoginFormModule {
}
