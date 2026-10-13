import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../../../shared/services/purchaseorder.service';
import DevExpress from 'devextreme';
import { SupplierService } from '../../../shared/services/supplier.service';
import { WarehouseService } from '../../../shared/services/warehouse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IMetaData } from '../../../shared/models/metadata';
import CustomStore = DevExpress.data.CustomStore;

@Component({
	selector: 'app-purchase-order-list',
	templateUrl: './purchase-order-list.component.html',
	styleUrls: ['./purchase-order-list.component.scss']
})
export class PurchaseOrderListComponent implements OnInit {

	metaData: IMetaData;

	purchaseOrderDataSource: CustomStore;
	supplierDataSource: CustomStore;
	warehouseDataSource: CustomStore;

	constructor(private purchaseOrderServie: PurchaseOrderService,
				private supplierService: SupplierService,
				private warehouseService: WarehouseService,
				private router: Router,
				private activatedRoute: ActivatedRoute) {
		this.editorPurchaseOrder = this.editorPurchaseOrder.bind(this);
		this.canViewPurchaseOrder = this.canViewPurchaseOrder.bind(this);
	}

	ngOnInit(): void {
		this.activatedRoute.data.subscribe(data => {
			this.metaData = data.metadata;
		});
		this.warehouseDataSource = this.warehouseService.getWarehouses();
		this.supplierDataSource = this.supplierService.getSuppliers();
		this.purchaseOrderDataSource = this.purchaseOrderServie.getPurchaseOrders();
	}

	openPurchaseOrder(id: number) {
		this.router.navigate(['/purchase-order/' + id]);
	}

	editorPurchaseOrder(e) {
		this.router.navigate(['/purchase-order/' + e.row.data.id]);
	}

	canViewPurchaseOrder(e) {
		return true;
	}

}
