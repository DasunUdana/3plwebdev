import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IProduct } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { MetadataService } from '../../../shared/services/metadata.service';
import { IMetaData } from '../../../shared/models/metadata';
import DevExpress from 'devextreme';
import { SupplierService } from '../../../shared/services/supplier.service';
import { LoaderHandler } from '../../../shared/utilities/loader.handler';
import { NotifyHandler } from '../../../shared/utilities/notify.handler';
import CustomStore = DevExpress.data.CustomStore;

@Component({
	templateUrl: 'product-update.component.html',
	styleUrls: ['./product-update.component.scss']
})

export class ProductUpdateComponent implements OnInit {
	product: IProduct;
	metadata: IMetaData;
	supplierStore: CustomStore;

	constructor(
		private metadataService: MetadataService,
		private productService: ProductService,
		private supplierService: SupplierService,
		private loader: LoaderHandler,
		private notify: NotifyHandler,
		private route: ActivatedRoute,
		private router: Router,
	) {
	}

	ngOnInit(): void {

		this.route.data.subscribe(data => {
			this.metadata = data.metadata;
		});

		this.supplierStore = this.supplierService.getSuppliers();

		const productId = this.route.snapshot.paramMap.get('id');

		if ( productId !== '0' ) {
			this.productService.getProductById(+productId).subscribe(product => {
				this.product = product;
			});
		} else {
			this.product = this.getNewProduct();
		}
	}

	backToList() {
		this.router.navigate(['/products']);
	}

	handleSubmit(e: Event) {
		e.preventDefault();
		if ( this.product.id === 0 ) {
			this.productService.createProduct(this.product).subscribe(product => {
				this.loader.show(false);
				this.notify.success('Product create successfully');
				this.router.navigate(['/products']);
			});
		} else {
			this.productService.updateProduct(this.product).subscribe(product => {
				this.loader.show(false);
				this.notify.success('Product updated successfully');
				this.router.navigate(['/products']);
			});
		}
	}

	private getNewProduct() {
		return { id: 0, weight: 0, width: 0, height: 0, reorderLevel: 0, unitPrice: 0, length: 0 } as IProduct;
	}

}

