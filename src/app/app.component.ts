import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { AppInfoService, AuthService, ScreenService } from './shared/services';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {
	constructor(private authService: AuthService, private screen: ScreenService, public appInfo: AppInfoService) {
	}

	@HostBinding('class') get getClass() {
		return Object.keys(this.screen.sizes).filter(cl => this.screen.sizes[cl]).join(' ');
	}

	get isAuthenticated() {
		return this.authService.loggedIn;
	}
}
