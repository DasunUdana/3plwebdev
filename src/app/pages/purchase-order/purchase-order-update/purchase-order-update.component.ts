import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import DevExpress from 'devextreme';

import { DxDataGridComponent } from 'devextreme-angular';

import { IPurchaseOrder, IPurchaseOrderItem } from '../../../shared/models/purchaseOrder';
import { SupplierService } from '../../../shared/services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderHandler } from '../../../shared/utilities/loader.handler';
import { NotifyHandler } from '../../../shared/utilities/notify.handler';
import { PurchaseOrderService } from '../../../shared/services/purchaseorder.service';
import { WarehouseService } from '../../../shared/services/warehouse.service';
import { ProductService } from '../../../shared/services/product.service';
import CustomStore = DevExpress.data.CustomStore;
import { confirm } from 'devextreme/ui/dialog';
import { IMetaData } from '../../../shared/models/metadata';

@Component({
	selector: 'app-purchase-order-update',
	templateUrl: './purchase-order-update.component.html',
	styleUrls: ['./purchase-order-update.component.scss']
})
export class PurchaseOrderUpdateComponent implements OnInit {

	metadata: IMetaData;

	purchaseOrder: IPurchaseOrder = this.getNewPurchaseOrder();
	supplierStore: CustomStore;
	warehouseStore: CustomStore;
	productStore: CustomStore;

	purchaseOrderItemGridValid = true;

	storageInfo = {
		purchaseOrderStorage: 0,
		allocatedStorage: 0,
		usedAllocatedStorage: 0,
		freeStorage: 0
	};

	@ViewChild('dxDataGridPurchaseOrderItems') dataGrid: DxDataGridComponent;

	constructor(
		private supplierService: SupplierService,
		private warehouseService: WarehouseService,
		private purchaseOrderService: PurchaseOrderService,
		private productService: ProductService,
		private route: ActivatedRoute,
		private router: Router,
		private loader: LoaderHandler,
		private notify: NotifyHandler,
		private cdr: ChangeDetectorRef
	) {
		this.onSupplierChanged = this.onSupplierChanged.bind(this);
	}

	ngOnInit(): void {
		this.route.data.subscribe(data => {
			this.metadata = data.metadata;
		});
		this.productStore = this.productService.getProducts();
		this.supplierStore = this.supplierService.getSuppliers();
		this.warehouseStore = this.warehouseService.getWarehouses();
		this.setPurchaseOrder();
	}

	get canEdit(): boolean {

		if (!this.purchaseOrder) {
			return false;
		}
		if (this.purchaseOrder.id === 0) {
			return true;
		}
		if (this.purchaseOrder.status !== 0) {
			return false;
		}
		if (!this.purchaseOrder.printed) {
			return true;
		}
		return false;

	}

	handleSubmit(e: Event) {
		e.preventDefault();

		if ( ! this.purchaseOrderItemGridValid ) {
			this.notify.error('Please check the purchase order items');
			return;
		}

		if ( this.purchaseOrder.purchaseOrderItems == null || this.purchaseOrder.purchaseOrderItems.length == 0 ) {
			this.notify.error('Purchase order should have at lease one purchase order item');
			return;
		}

		if (this.storageInfo.freeStorage < this.storageInfo.purchaseOrderStorage) {
			const result = confirm('<i>The current purchase order is exceed the limit of the allocated storage of supplier. Do you want to continue it?</i>',
				'Storage Exceed');
			result.then((dialogResult) => {
				if (dialogResult) {
					this.savePurchaseOrder();
				}
			});
		}else {
			this.savePurchaseOrder();
		}

	}

	onRowValidating(e) {
		this.purchaseOrderItemGridValid = e.isValid;
	}

	calcualteTotal(rowData) {
		if ( rowData == null ) {
			return 0;
		}
		if ( ! (rowData.unitCost) || ! (rowData.quantity) ) {
			return 0;
		}
		return rowData.unitCost * rowData.quantity;
	}

	onEditorPreparing(e) {
		if (e.dataField === 'productId') {
			const standardHandler = e.editorOptions.onValueChanged;
			e.editorOptions.onValueChanged = (editorEvent) => {
				standardHandler(editorEvent);
				this.productService.getProductById(editorEvent.value).subscribe(product => {
					e.component.cellValue(e.row.rowIndex, 'unitCost', product.unitPrice);
					e.component.editCell(e.row.rowIndex, 1);
				});
			};
		}
	}

	onGridSaved(e) {
		this.calculatePurchaseOrderStorage();
	}

	onSupplierChanged(e) {
		this.supplierService.getSupplierStorageDetails(e.value).subscribe(response => {
			this.storageInfo.allocatedStorage = response.allocatedStorage;
			this.storageInfo.usedAllocatedStorage = response.totalStorage;
			this.storageInfo.freeStorage = this.storageInfo.allocatedStorage - this.storageInfo.usedAllocatedStorage;
			if (this.storageInfo.freeStorage < 0) {
				this.storageInfo.freeStorage = 0;
			}
		});
	}

	public backToPurchaseOrders() {
		this.router.navigate(['/purchase-orders']);
	}

	public printPurchaseOrder() {
		this.router.navigate(['/purchase-order-print-view', this.purchaseOrder.id]);
	}

	private setPurchaseOrder() {
		this.purchaseOrder = this.getNewPurchaseOrder();
		const purchaseOrderId = this.route.snapshot.paramMap.get('id');

		if ( purchaseOrderId !== '0' ) {
			this.purchaseOrderService.getPurchaseOrderById(+purchaseOrderId).subscribe((data: IPurchaseOrder) => {
				this.purchaseOrder = data;
				this.calculatePurchaseOrderStorage();
			});
		} else {
			this.purchaseOrder.purchaseOrderItems = [];
		}

		this.calculatePurchaseOrderStorage();
	}

	private calculatePurchaseOrderStorage() {
		if (this.purchaseOrder.purchaseOrderItems == null) {
			this.storageInfo.purchaseOrderStorage = 0;
			return;
		}
		this.purchaseOrderService.calculateStorage({
			products : this.purchaseOrder.purchaseOrderItems.map(item => {
				return {
					productId: item.productId,
					quantity: item.quantity
				};
			})
		}).subscribe(response => {
			this.storageInfo.purchaseOrderStorage = response.totalStorage;
		});
	}

	private savePurchaseOrder() {
		this.loader.show(true);
		if ( this.purchaseOrder.id === 0 ) {
			this.purchaseOrderService.addPurchaseOrder(this.purchaseOrder).subscribe(data => {
				this.notify.success('Successfully created purchase order');
				this.loader.show(false);
				this.router.navigate(['/purchase-orders']);
			});
		} else {
			this.purchaseOrderService.updatePurchaseOrder(this.purchaseOrder).subscribe(data => {
				this.notify.success('Successfully updated purchase order');
				this.loader.show(false);
				this.router.navigate(['/purchase-orders']);
			});
		}
	}

	private getNewPurchaseOrder() {
		return { id: 0, supplierId: null, wareHouseId: null, purchaseOrderItems: null, status: 0 } as IPurchaseOrder;
	}
}
