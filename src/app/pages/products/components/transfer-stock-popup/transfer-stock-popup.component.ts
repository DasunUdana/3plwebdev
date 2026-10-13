import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { DxFormComponent } from 'devextreme-angular';
import { LoaderHandler } from '../../../../shared/utilities/loader.handler';
import { StockTransferService } from '../../../../shared/services/stocktransfer.service';
import { WarehouseService } from '../../../../shared/services/warehouse.service';
import { ProductService } from '../../../../shared/services/product.service';
import { IProductStockTransfer} from '../../../../shared/models/stockTransfer';

@Component({
	selector: 'app-transfer-stock-popup',
	templateUrl: './transfer-stock-popup.component.html',
	styleUrls: ['./transfer-stock-popup.component.scss']
})
export class TransferStockPopupComponent implements OnInit {

	@Input()
	visible = false;

	@Input()
	wareHouseId = 0;

	@Input()
	productId = 0;

	@Input()
	quantity = 0;

	@Input()
	unitCost = 0;

	@Input()
	transferType = '';

	@Output() onSuccess = new EventEmitter();
	@Output() onCancel = new EventEmitter();

	warehouseStore: CustomStore;
	productStore: CustomStore;

	title = '';

	public stockTransfer: IProductStockTransfer;
	@ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;

	constructor(
		private warehouseService: WarehouseService,
		private productService: ProductService,
		private stockTransferService: StockTransferService,
		private loader: LoaderHandler,
	) {
		this.warehouseStore = warehouseService.getWarehouses();
		this.productStore = productService.getProducts();
	}

	ngOnInit(): void {
		this.stockTransfer = {
			productId: this.productId,
			wareHouseId: this.wareHouseId,
			quantity: this.quantity,
			unitCost: this.unitCost,
			expiredDate: null,
			transferType: this.transferType,
			damageQuantity: 0,
			trackingNumber: null,
			note: null
		};
	}

	handleSubmit(e: Event): void {
		e.preventDefault();
		this.loader.show(true);
		this.stockTransferService.transferStock(this.stockTransfer)
			.subscribe(() => {
			this.onSuccess.emit('success');
			this.loader.show(false);
		});
	}

	onShowingPopup(e: Event): void {
		this.title = 'Transfer ' + this.transferType;
		if (this.form) {
			this.form.instance.resetValues();
		}
		this.stockTransfer = {
			productId: this.productId,
			wareHouseId: this.wareHouseId,
			quantity: this.quantity,
			unitCost: this.unitCost,
			expiredDate: null,
			trackingNumber: null,
			damageQuantity: 0,
			transferType: this.transferType,
			note: null
		};
	}

	onClosePopup(e: Event): void {
		this.onCancel.emit('cancel');
	}


}
