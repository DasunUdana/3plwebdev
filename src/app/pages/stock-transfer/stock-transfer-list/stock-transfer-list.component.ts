import { Component, OnInit } from '@angular/core';
import DevExpress from 'devextreme';
import { SupplierService } from '../../../shared/services/supplier.service';
import { WarehouseService } from '../../../shared/services/warehouse.service';
import { ActivatedRoute, Router } from '@angular/router';
import CustomStore = DevExpress.data.CustomStore;
import { StockTransferService } from '../../../shared/services/stocktransfer.service';

@Component({
	selector: 'app-stock-transfers-list',
	templateUrl: './stock-transfer-list.component.html',
	styleUrls: ['./stock-transfer-list.component.scss']
})
export class StockTransferListComponent implements OnInit {

	stockTransferDataSource: CustomStore;
	supplierDataSource: CustomStore;
	warehouseDataSource: CustomStore;

	constructor(private stockTransferService: StockTransferService,
				private supplierService: SupplierService,
				private warehouseService: WarehouseService,
				private router: Router,
				private activatedRoute: ActivatedRoute) {
		this.viewStockTransfer = this.viewStockTransfer.bind(this);
	}

	ngOnInit(): void {
		this.warehouseDataSource = this.warehouseService.getWarehouses();
		this.supplierDataSource = this.supplierService.getSuppliers();
		this.stockTransferDataSource = this.stockTransferService.getStockTransfers();
	}

	openStockTransfer(id: number) {
		this.router.navigate(['/stock-transfer/' + id]);
	}

	viewStockTransfer(e) {
		this.router.navigate(['/stock-transfer/' + e.row.data.id]);
	}

}
