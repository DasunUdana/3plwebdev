import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WarehouseService } from 'src/app/shared/services/warehouse.service';
import DevExpress from 'devextreme';
import CustomStore = DevExpress.data.CustomStore;


@Component({
	templateUrl: 'warehouse-list.component.html',
	styleUrls: ['./warehouse-list.component.scss']
})

export class WarehouseListComponent implements OnInit {
	warehouses: CustomStore;

	constructor(
		private warehouseService: WarehouseService,
		private router: Router,
	) {
		this.editWarehouse = this.editWarehouse.bind(this);
	}


	ngOnInit(): void {
		this.warehouses = this.warehouseService.getWarehouses();
	}

	openWarehouse(id: number) {
		this.router.navigate(['/warehouse/' + id]);
	}

	editWarehouse(e) {
		this.router.navigate(['/warehouse/' + e.row.data.id]);
	}

}

