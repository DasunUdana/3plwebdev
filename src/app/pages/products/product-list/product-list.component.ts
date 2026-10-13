import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import DevExpress from 'devextreme';
import { SupplierService } from '../../../shared/services/supplier.service';
import { IMetaData } from '../../../shared/models/metadata';
import { MetadataService } from '../../../shared/services/metadata.service';
import CustomStore = DevExpress.data.CustomStore;
import { AuthService } from '../../../shared/services';
import { WarehouseService } from '../../../shared/services/warehouse.service';


@Component({
	templateUrl: 'product-list.component.html',
	styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {

	metaData: IMetaData;
	productStore: CustomStore;
	supplierStore: CustomStore;
	warehouseStore: CustomStore;

	constructor(
		private productService: ProductService,
		private warehouseService: WarehouseService,
		private authService: AuthService,
		private metadataService: MetadataService,
		private supplierService: SupplierService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		this.editProduct = this.editProduct.bind(this);
		this.viewProduct = this.viewProduct.bind(this);
	}


	ngOnInit(): void {
		this.activatedRoute.data.subscribe(data => {
			this.metaData = data.metadata;
		});

		this.productStore = this.productService.getProducts();
		this.supplierStore = this.supplierService.getSuppliers();
		this.warehouseStore = this.warehouseService.getWarehouses();

	}

	canAdd() {
		return this.authService.isAdmin || this.authService.isWareHouseManager;
	}

	canEdit() {
		return this.authService.isAdmin || this.authService.isWareHouseManager;
	}

	canDisplaySupplierColumn() {
		return !this.authService.isSupplier;
	}

	openProduct(id: number) {
		this.router.navigate(['/product/' + id]);
	}

	editProduct(e) {
		this.router.navigate(['/product/' + e.row.data.id]);
	}

	viewProduct(e) {
		this.router.navigate(['/product/product-details/' + e.row.data.id]);
	}

}

