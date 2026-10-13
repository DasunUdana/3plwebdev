import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IWarehouse } from 'src/app/shared/models/warehouse';
import { WarehouseService } from 'src/app/shared/services/warehouse.service';
import { CityService } from '../../../shared/services/city.service';
import DevExpress from 'devextreme';
import { LoaderHandler } from '../../../shared/utilities/loader.handler';
import { NotifyHandler } from '../../../shared/utilities/notify.handler';
import CustomStore = DevExpress.data.CustomStore;


@Component({
	templateUrl: 'warehouse-update.component.html',
	styleUrls: ['./warehouse-update.component.scss']
})

export class WarehouseUpdateComponent implements OnInit {
	warehouse: IWarehouse;
	cityStore: CustomStore;

	@ViewChild('documentEditForm') documentEditForm: FormGroupDirective;

	constructor(
		private warehouseService: WarehouseService,
		private cityService: CityService,
		private loader: LoaderHandler,
		private notify: NotifyHandler,
		private route: ActivatedRoute,
		private router: Router,
	) {
	}

	ngOnInit(): void {
		this.cityStore = this.cityService.getCities();
		let warehouseId = this.route.snapshot.paramMap.get('id');

		if ( warehouseId !== '0' ) {
			this.warehouseService.getWarehouseById(+warehouseId).subscribe(warehouse => {
				this.warehouse = warehouse;
			});
		} else {
			this.warehouse = this.getNewWarehouse();
		}
	}

	backToList() {
		this.router.navigate(['/warehouses']);
	}

	handleSubmit(e: Event) {
		e.preventDefault();
		this.loader.show(true);
		if ( this.warehouse.id === 0 ) {
			this.warehouseService.addWarehouse(this.warehouse).subscribe(warehouse => {
				this.loader.show(false);
				this.notify.success('Warehouse create successfully');
				this.router.navigate(['/warehouses']);
			});
		} else {
			this.warehouseService.updateWarehouse(this.warehouse).subscribe(warehouse => {
				this.loader.show(false);
				this.notify.success('Warehouse updated successfully');
				this.router.navigate(['/warehouses']);
			});
		}
	}

	private getNewWarehouse() {
		return {
			id: 0,
			active: true,
			address: {
				city: null,
				cityId: 0,
				addressLine1: null,
				addressLine2: null,
				firstName: null,
				lastName: null,
				postalCode: null
			},
			name: null,
			height: 0,
			length: 0,
			width: 0,
		} as IWarehouse;
	}

}

