import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';

const TOAST_DISPLAY_TIME: number = 3000;
const TOAST_WIDTH: number = 340;
const TOAST_HEIGHT: string = 'auto';
const TOAST_POSITION: any = { my: 'top right', at: 'top right', of: window, offset: '-40 40' };


@Injectable()
export class NotifyHandler {

	constructor() {
	}

	success(message: string) {
		notify({
			message: message,
			type: 'success',
			displayTime: TOAST_DISPLAY_TIME,
			height: TOAST_HEIGHT,
			width: TOAST_WIDTH,
			position: TOAST_POSITION
		});
	}

	warning(message: string) {
		notify({
			message: message,
			type: 'warning',
			displayTime: TOAST_DISPLAY_TIME,
			height: TOAST_HEIGHT,
			width: TOAST_WIDTH,
			position: TOAST_POSITION
		});
	}

	error(message: string) {
		notify({
			message: message,
			type: 'error',
			displayTime: TOAST_DISPLAY_TIME,
			height: TOAST_HEIGHT,
			width: TOAST_WIDTH,
			position: TOAST_POSITION
		});
	}

}
