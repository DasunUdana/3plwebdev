import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import DevExpress from 'devextreme';
import { StockService } from '../../../../shared/services/stock.service';
import CustomStore = DevExpress.data.CustomStore;
import { DxDataGridComponent } from 'devextreme-angular';
import { IProductStock } from '../../../../shared/models/product';
import { AuthService } from '../../../../shared/services';


@Component({
	selector: 'app-product-stocks',
	templateUrl: 'product-stocks.component.html'
})

export class ProductStocksComponent implements OnInit {

	@Input()
	productId: number;
	@Input()
	warehouseDataSource: CustomStore;
	@Input()
	displayActions: boolean;

	@Output() onTransferDispatchReturnStock = new EventEmitter<IProductStock>();
	@Output() onTransferSaleReturnStock = new EventEmitter<IProductStock>();

	@ViewChild(DxDataGridComponent, { static: false }) productStocksGrid: DxDataGridComponent;

	productStocksDataSource: CustomStore;

	constructor(
		private stockService: StockService,
		private authService: AuthService
	) {
		this.transferDispatchReturnStock = this.transferDispatchReturnStock.bind(this);
		this.transferSalesReturnStock = this.transferSalesReturnStock.bind(this);
	}

	ngOnInit(): void {
		this.productStocksDataSource = this.stockService.getProductStocksByProductId(this.productId);
	}

	public refresh(): void {
		this.productStocksGrid.instance.refresh();
	}

	public transferDispatchReturnStock(e) {
		if (!this.onTransferDispatchReturnStock) {
			return;
		}
		this.onTransferDispatchReturnStock.emit(e.row.data);
	}

	public transferSalesReturnStock(e) {
		if (!this.onTransferSaleReturnStock) {
			return;
		}
		this.onTransferSaleReturnStock.emit(e.row.data);
	}

	canMoveStock() {
		return (this.authService.isAdmin || this.authService.isWareHouseManager) && this.displayActions;
	}

}

