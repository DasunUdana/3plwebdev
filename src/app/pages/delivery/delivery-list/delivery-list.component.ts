import { Component, OnInit, ViewChild } from '@angular/core';
import DevExpress from 'devextreme';
import { confirm } from 'devextreme/ui/dialog';
import { SupplierService } from '../../../shared/services/supplier.service';
import { WarehouseService } from '../../../shared/services/warehouse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from '../../../shared/services/delivery.service';
import { IMetaData } from '../../../shared/models/metadata';
import CustomStore = DevExpress.data.CustomStore;
import { LoaderHandler } from '../../../shared/utilities/loader.handler';
import { NotifyHandler } from '../../../shared/utilities/notify.handler';
import { AuthService } from '../../../shared/services';
import { ACCESS_TOKEN_KEY } from '../../../shared/constants/common';
import { DxDataGridComponent, DxFileUploaderComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

@Component({
	selector: 'app-delivery-list',
	templateUrl: './delivery-list.component.html',
	styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit {

	@ViewChild('fileUploader') fileUploader: DxFileUploaderComponent;
	@ViewChild('grid') grid: DxDataGridComponent;

	deliveryCompleteProcessUploadUrl = null;

	metaData: IMetaData;
	deliveryDataSource: CustomStore;
	supplierDataSource: CustomStore;
	warehouseDataSource: CustomStore;

	showUploadDeliverySheetPopup = false;
	showUploadDeliverySheetResultPopup = false;

	uploadCompleteSheetResultDataSource: DataSource;

	constructor(private deliveryService: DeliveryService,
				private authService: AuthService,
				private supplierService: SupplierService,
				private warehouseService: WarehouseService,
				private router: Router,
				private loader: LoaderHandler,
				private notify: NotifyHandler,
				private activatedRoute: ActivatedRoute) {
		this.viewDelivery = this.viewDelivery.bind(this);
	}

	ngOnInit(): void {
		this.activatedRoute.data.subscribe(data => {
			this.metaData = data.metadata;
		});
		this.warehouseDataSource = this.warehouseService.getWarehouses();

		if (!this.isSupplier()) {
			this.supplierDataSource = this.supplierService.getSuppliers();
		}

		this.deliveryDataSource = this.deliveryService.getDeliveries();
		this.deliveryCompleteProcessUploadUrl = this.deliveryService.getDeliveryCompleteUploadUrl();
	}

	openDelivery(id: number) {
		this.router.navigate(['/delivery/' + id]);
	}

	viewDelivery(e) {
		this.router.navigate(['/delivery/' + e.row.data.id]);
	}

	isSupplier() {
		return this.authService.isSupplier;
	}

	uploadDeliverySheet() {
		this.showUploadDeliverySheetPopup = true;
		if (this.fileUploader) {
			this.fileUploader.instance.reset();
		}
	}

	onBeforeSend(e){
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		e.request.setRequestHeader('Authorization', 'Bearer ' + token);
	}

	onUploaded(e) {
		this.loader.show(false);
		if (this.grid){
			this.grid.instance.refresh();
		}
		this.showUploadDeliverySheetPopup = false;
		this.uploadCompleteSheetResultDataSource = new DataSource({
			store: new ArrayStore({
				data: JSON.parse(e.request.response)
			})
		});
		this.showUploadDeliverySheetResultPopup = true;
	}

	onUploadStarted(e) {
		this.loader.show(true);
	}
}
