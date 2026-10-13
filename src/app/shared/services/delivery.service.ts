import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { NotifyHandler } from '../utilities/notify.handler';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ACCESS_TOKEN_KEY } from '../constants/common';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoaderHandler } from '../utilities/loader.handler';
import {
	IDelivery,
	IDeliveryStat,
	ILatestDeliveryItemPriceResponse,
	ITrackingDetails,
} from '../models/delivery';

@Injectable()
export class DeliveryService extends BaseService {

	constructor(
		private http: HttpClient,
		public notify: NotifyHandler,
		public loader: LoaderHandler,
		public router: Router,
	) {
		super(notify, loader, router);
	}

	public getDeliveries() {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		return AspNetData.createStore({
			key: 'id',
			loadUrl: this.apiUrl + '/Delivery',
			onBeforeSend(method, ajaxOptions) {
				ajaxOptions.headers = { Authorization: 'Bearer ' + token };
			}
		});
	}

	public getDeliveryById(id: number): Observable<IDelivery> {
		return this.http.get<IDelivery>(this.apiUrl + '/Delivery/get-delivery/' + id)
			.pipe(catchError(e => this.handleError(e, 'Getting delivery by id')));
	}

	public getDeliveryStat(): Observable<IDeliveryStat> {
		return this.http.get<IDeliveryStat>(this.apiUrl + '/Delivery/delivery-stat')
			.pipe(catchError(e => this.handleError(e, 'Getting delivery stat')));
	}

	public addDelivery(delivery: IDelivery) {
		return this.http.post<IDelivery>(this.apiUrl + '/Delivery', delivery)
			.pipe(catchError(e => this.handleError(e, 'Create delivery')));
	}

	public updateDelivery(delivery: IDelivery) {
		return this.http.put<IDelivery>(this.apiUrl + '/Delivery', delivery)
			.pipe(catchError(e => this.handleError(e, 'Update delivery')));
	}

	public mapDeliveryProduct(delivery: IDelivery) {
		return this.http.put<IDelivery>(this.apiUrl + '/Delivery/map-delivery-product', delivery)
			.pipe(catchError(e => this.handleError(e, 'Mapping products to tracking numbers')));
	}

	public markAsProcessing(deliveryId: number, requiredTrackingNumbers: number) {
		return this.http.post(this.apiUrl + '/Delivery/mark-as-processing',
			{ deliveryId, requiredTrackingNumberCount: requiredTrackingNumbers })
			.pipe(catchError(e => this.handleError(e, 'Mark as processing')));
	}

	public markAsDispatch(deliveryId: number, warehouseId: number) {
		return this.http.post(this.apiUrl + '/Delivery/mark-as-dispatch',
			{ deliveryId, WarehouseId: warehouseId })
			.pipe(catchError(e => this.handleError(e, 'Mark as dispatch')));
	}

	public markAsComplete(deliveryId: number, trackingNumbers: string[]) {
		return this.http.post(this.apiUrl + '/Delivery/mark-as-complete',
			{ deliveryId, trackingNumbers })
			.pipe(catchError(e => this.handleError(e, 'Mark as complete')));
	}

	public markAsReturn(deliveryId: number, trackingNumbers: string[], note: string) {
		return this.http.post(this.apiUrl + '/Delivery/mark-as-return',
			{ deliveryId, note, trackingNumbers })
			.pipe(catchError(e => this.handleError(e, 'Mark as return')));
	}

	public markAsDelete(deliveryId: number) {
		return this.http.post(this.apiUrl + '/Delivery/delete-delivery/' + deliveryId,'')
			.pipe(catchError(e => this.handleError(e, 'Mark as Delete')));
	}
	
	public getLatestDeliveryPrice(productId: number) {
		return this.http.get<ILatestDeliveryItemPriceResponse>(this.apiUrl
			+ '/Delivery/latest-delivery-unit-price/' + productId)
			.pipe(catchError(e => this.handleError(e, 'Unable to get latest delivery price')));
	}

	public getTrackingDetails(trackingNumber: string): Observable<ITrackingDetails> {
		return this.http.get<ITrackingDetails>(this.apiUrl + `/Delivery/get-tracking-details/${trackingNumber}`)
			.pipe(catchError(e => this.handleError(e, 'Get tracking details')));
	}

	public getDeliveryCompleteUploadUrl() {
		return this.apiUrl + '/Delivery/process-delivery-sheet';
	}
}

