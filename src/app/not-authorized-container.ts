import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SingleCardModule } from 'src/app/layouts';

@Component({
	selector: 'app-not-authorized-container',
	template: `
    <app-single-card>
      <router-outlet></router-outlet>
    </app-single-card>
  `,
	styles: [`
    :host {
      width: 100%;
      height: 100%;
    }
  `]
})
export class NotAuthorizedContainerComponent {

	constructor(private router: Router) {
	}
}

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		SingleCardModule,
	],
	declarations: [NotAuthorizedContainerComponent],
	exports: [NotAuthorizedContainerComponent]
})
export class NotAuthorizedContainerModule {
}
