import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import DevExpress from 'devextreme';
import { StockService } from '../../../../shared/services/stock.service';
import { IStockAdjustmentType } from '../../../../shared/models/metadata';
import CustomStore = DevExpress.data.CustomStore;
import { DxDataGridComponent } from 'devextreme-angular';


@Component({
	selector: 'app-product-stock-adjustments',
	templateUrl: 'product-stock-adjustments.component.html'
})

export class ProductStockAdjustmentsComponent implements OnInit {

	@ViewChild(DxDataGridComponent, { static: false }) stockAdjustmentsGrid: DxDataGridComponent;

	@Input() productId: number;
	@Input() stockAdjustmentTypes: IStockAdjustmentType[];
	@Input() warehouseDataSource: CustomStore;

	stockAdjustmentsDataSource: CustomStore;


	constructor(
		private stockService: StockService
	) {
	}

	ngOnInit(): void {
		this.stockAdjustmentsDataSource = this.stockService.getProductStockAdjustmentsByProductId(this.productId);
	}

	public refresh(): void {
		if (!this.stockAdjustmentsGrid) {
			return;
		}
		this.stockAdjustmentsGrid.instance.refresh();
	}

}

