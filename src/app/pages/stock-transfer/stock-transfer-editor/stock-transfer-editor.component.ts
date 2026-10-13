import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import DevExpress from 'devextreme';

import { DxDataGridComponent } from 'devextreme-angular';

import { IPurchaseOrder } from '../../../shared/models/purchaseOrder';
import { SupplierService } from '../../../shared/services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderHandler } from '../../../shared/utilities/loader.handler';
import { NotifyHandler } from '../../../shared/utilities/notify.handler';
import { PurchaseOrderService } from '../../../shared/services/purchaseorder.service';
import { WarehouseService } from '../../../shared/services/warehouse.service';
import { ProductService } from '../../../shared/services/product.service';
import CustomStore = DevExpress.data.CustomStore;
import { IStockTransfer } from '../../../shared/models/stockTransfer';
import { StockTransferService } from '../../../shared/services/stocktransfer.service';

@Component({
	selector: 'app-stock-transfer-editor',
	templateUrl: './stock-transfer-editor.component.html',
	styleUrls: ['./stock-transfer-editor.component.scss']
})
export class StockTransferEditorComponent implements OnInit {

	stockTransfer: IStockTransfer;
	supplierStore: CustomStore;
	warehouseStore: CustomStore;
	productStore: CustomStore;

	stockTransferItemGridValid = true;

	constructor(
		private supplierService: SupplierService,
		private warehouseService: WarehouseService,
		private stockTransferService: StockTransferService,
		private productService: ProductService,
		private route: ActivatedRoute,
		private router: Router,
		private loader: LoaderHandler,
		private notify: NotifyHandler,
		private cdr: ChangeDetectorRef
	) {
		this.onEditorPreparing = this.onEditorPreparing.bind(this);
	}

	ngOnInit(): void {
		this.productStore = this.productService.getProducts();
		this.supplierStore = this.supplierService.getSuppliers();
		this.warehouseStore = this.warehouseService.getWarehouses();
		this.setStockTransfer();
	}

	handleSubmit(e: Event) {
		e.preventDefault();
		if ( ! this.stockTransferItemGridValid ) {
			this.notify.error('Please check the stock transfer items');
			return;
		}
		if ( this.stockTransfer.stockTransferItems == null || this.stockTransfer.stockTransferItems.length == 0 ) {
			this.notify.error('Stock transfer should have at lease one transfer item');
			return;
		}
		this.loader.show(true);
		this.stockTransferService.addStckTransfer(this.stockTransfer).subscribe(data => {
			this.notify.success('Successfully created stock transfer');
			this.loader.show(false);
			this.router.navigate(['/stock-transfers']);
		});
	}

	onRowValidating(e) {
		this.stockTransferItemGridValid = e.isValid;
	}

	calcualteTotal(rowData) {
		if ( rowData == null ) {
			return 0;
		}
		if ( ! (rowData.unitCost) || ! (rowData.quantity) ) {
			return 0;
		}
		return rowData.unitCost * rowData.quantity;
	}

	public backToStockTransfers() {
		this.router.navigate(['/stock-transfers']);
	}

	onEditorPreparing(e) {
		if (e.dataField === 'productId') {
			const standardHandler = e.editorOptions.onValueChanged;
			e.editorOptions.onValueChanged = (editorEvent) => {
				standardHandler(editorEvent);
				this.productService.getProductById(editorEvent.value).subscribe(product => {
					e.component.cellValue(e.row.rowIndex, 'unitCost', product.unitPrice);
					e.component.editCell(e.row.rowIndex, 1);
				});
			};
		}
	}

	private setStockTransfer() {
		this.stockTransfer = this.getNewStockTransfers();
		const stockTransferId = this.route.snapshot.paramMap.get('id');

		if ( stockTransferId !== '0' ) {
			this.stockTransferService.getStockTransferById(+stockTransferId).subscribe((data: IStockTransfer) => {
				this.stockTransfer = data;
			});
		} else {
			this.stockTransfer.stockTransferItems = [];
		}
	}

	private getNewStockTransfers() {
		return { id: 0, toWareHouseId: null, fromWareHouseId: null, reason: null, stockTransferItems: null } as IStockTransfer;
	}
}
