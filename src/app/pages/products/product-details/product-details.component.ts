import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import DevExpress from 'devextreme';
import { IMetaData } from '../../../shared/models/metadata';
import { WarehouseService } from 'src/app/shared/services/warehouse.service';
import CustomStore = DevExpress.data.CustomStore;
import { IProduct, IProductStock } from '../../../shared/models/product';
import { ProductService } from '../../../shared/services/product.service';
import { SupplierService } from '../../../shared/services/supplier.service';
import { NotifyHandler } from '../../../shared/utilities/notify.handler';
import { ProductStocksComponent } from '../components/product-stocks/product-stocks.component';
import { ProductStockAdjustmentsComponent } from '../components/product-stock-adjustments/product-stock-adjustments.component';
import { AuthService } from '../../../shared/services';

@Component({
	templateUrl: 'product-details.component.html',
	styleUrls: ['./product-details.component.scss']
})

export class ProductDetailsComponent {

	product: IProduct;
	productId: number = null;
	metadata: IMetaData = { stockAdjustmentTypes: [] } as IMetaData;
	warehouseDataSource: CustomStore;
	supplierStore: CustomStore;

	showTransferStockModal: boolean = false;
	transferStockType: string = null;

	@ViewChild(ProductStockAdjustmentsComponent, { static: false }) productStockAdjustmentsComponent: ProductStockAdjustmentsComponent;
	@ViewChild(ProductStocksComponent, { static: false }) productStocksSection: ProductStocksComponent;

	currentProductStock: IProductStock = { id: 0, productId: 0, quantity: 0, wareHouseId: 0,
		dispatchReturnQuantity: 0, damageStockQuantity: 0, salesReturnQuantity: 0 };

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private notify: NotifyHandler,
		private authService: AuthService,
		private warehouseService: WarehouseService,
		private productService: ProductService,
		private supplierService: SupplierService,
	) {
		const productIdFromRoute = this.route.snapshot.paramMap.get('id');

		if ( productIdFromRoute !== '0' ) {
			this.productId = +productIdFromRoute;
		}

		this.activatedRoute.data.subscribe(data => {
			this.metadata = data.metadata;
		});

		this.warehouseDataSource = this.warehouseService.getWarehouses();
		this.supplierStore = this.supplierService.getSuppliers();
		this.onTransferStock = this.onTransferStock.bind(this);
	}

	ngOnInit(): void {

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

	onTransferStock(type: string, productStock: IProductStock) {
		this.currentProductStock = productStock;
		this.transferStockType = type;
		console.log(this.transferStockType);
		if (type === 'Dispatch Return' && this.currentProductStock.dispatchReturnQuantity <= 0) {
			this.notify.warning('You dont have any stock to transfer');
			return;
		}
		if (type === 'Sales Return' && this.currentProductStock.salesReturnQuantity <= 0) {
			this.notify.warning('You dont have any stock to transfer');
			return;
		}
		this.transferStockModalShow();
	}

	transferStockModalShow(): void {
		this.showTransferStockModal = true;
	}

	onTransferStockSuccess(): void {
		this.notify.success('Successfully transferred the stock');
		this.showTransferStockModal = false;
		this.productStockAdjustmentsComponent.refresh();
		this.productStocksSection.refresh();
	}

	 onTransferStockModalCancel(): void {
		this.showTransferStockModal = false;
	}

	private getNewProduct() {
		return { id: 0 } as IProduct;
	}

}

