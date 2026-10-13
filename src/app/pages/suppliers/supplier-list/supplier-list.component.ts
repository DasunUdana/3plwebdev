import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SupplierService } from 'src/app/shared/services/supplier.service';
import { AuthService } from '../../../shared/services';


@Component({
	templateUrl: 'supplier-list.component.html',
	styleUrls: ['./supplier-list.component.scss']
})

export class SupplierListComponent implements OnInit {
	suppliers: any;

	constructor(
		private supplierService: SupplierService,
		private authService: AuthService,
		private router: Router,
	) {
		this.editSupplier = this.editSupplier.bind(this);
		this.viewSupplier = this.viewSupplier.bind(this);
	}


	ngOnInit(): void {
		this.suppliers = this.supplierService.getSuppliers();
	}

	canAdd() {
		return this.authService.isAdmin || this.authService.isWareHouseManager;
	}

	canUpdate() {
		return this.authService.isAdmin || this.authService.isWareHouseManager;
	}

	openSupplier(id: number) {
		this.router.navigate(['/supplier/' + id]);
	}

	editSupplier(e) {
		this.router.navigate(['/supplier/' + e.row.data.id]);
	}

	viewSupplier(e) {
		this.router.navigate(['/supplier/view/' + e.row.data.id]);
	}
}

