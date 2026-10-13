import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IGrn } from '../../../shared/models/grn';
import { SupplierService } from '../../../shared/services/supplier.service';
import { WarehouseService } from '../../../shared/services/warehouse.service';
import { PurchaseOrderService } from '../../../shared/services/purchaseorder.service';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderHandler } from '../../../shared/utilities/loader.handler';
import { NotifyHandler } from '../../../shared/utilities/notify.handler';
import DevExpress from 'devextreme';
import { GrnService } from '../../../shared/services/grn.service';
import CustomStore = DevExpress.data.CustomStore;
import { IMetaData } from '../../../shared/models/metadata';
import DataSource from 'devextreme/data/data_source';
import { confirm } from 'devextreme/ui/dialog';

@Component({
	selector: 'app-grn-editor',
	templateUrl: './grn-editor.component.html',
	styleUrls: ['./grn-editor.component.scss']
})
export class GrnEditorComponent implements OnInit {

	metadata: IMetaData;

	grn: IGrn;
	supplierStore: CustomStore;
	warehouseStore: CustomStore;
	productStore: CustomStore;
	purchaseOrderStore: DataSource;
	grnStore: DataSource;

	grnGridItemValid = true;
	grnTypeSuspendValueChagned = false;

	constructor(
		private supplierService: SupplierService,
		private grnServie: GrnService,
		private warehouseService: WarehouseService,
		private purchaseOrderService: PurchaseOrderService,
		private productService: ProductService,
		private route: ActivatedRoute,
		private router: Router,
		private loader: LoaderHandler,
		private notify: NotifyHandler,
		private cdr: ChangeDetectorRef
	) {
		this.onPurchaseOrderChange = this.onPurchaseOrderChange.bind(this);
		this.onGrnChange = this.onGrnChange.bind(this);
		this.onGrnTypeChange = this.onGrnTypeChange.bind(this);
	}

	ngOnInit(): void {
		this.route.data.subscribe(data => {
			this.metadata = data.metadata;
		});
		this.productStore = this.productService.getProducts();
		this.supplierStore = this.supplierService.getSuppliers();
		this.warehouseStore = this.warehouseService.getWarehouses();
		this.purchaseOrderStore = new DataSource({
			store: this.purchaseOrderService.getPurchaseOrders(),
			filter: ['status', '<>', 2],
			sort: [{ selector: 'created', desc: true }]
		});
		this.grnStore = new DataSource({
			store: this.grnServie.getGrns(),
			filter: ['type', '<>', 1]
		});
		this.setGrn();
	}

	handleSubmit(e: Event) {
		e.preventDefault();
		if ( ! this.grnGridItemValid ) {
			this.notify.error('Please check the grn items');
			return;
		}
		if ( this.grn.goodReceivedNoteItems == null || this.grn.goodReceivedNoteItems.length === 0 ) {
			this.notify.error('GRN should have at lease one item');
			return;
		}
		this.loader.show(true);
		this.grnServie.addGrn(this.grn).subscribe(data => {
			this.notify.success('Successfully created grn');
			this.loader.show(false);
			this.router.navigate(['/grn-list']);
		});
	}

	onRowValidating(e) {
		this.grnGridItemValid = e.isValid;
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

	onPurchaseOrderChange(e) {
		const purchaseOrderId = e.value;
		if (this.grn.id !== 0 || purchaseOrderId == null) {
			return;
		}
		this.loader.show(true);
		this.purchaseOrderService.getPurchaseOrderById(purchaseOrderId).subscribe(po => {
			if ( po.wareHouseId != null ) {
				this.grn.wareHouseId = po.wareHouseId;
			} else {
				this.grn.wareHouseId = null;
			}
			this.grn.supplierId = po.supplierId;
			const receivedNoteItems = po.purchaseOrderItems.map(item => {
				return {
					id: 0,
					productId: item.productId,
					quantity: item.quantity - item.receivedQuantity,
					unitCost: item.unitCost,
					expiredDate: null
				};
			});
			this.grn.goodReceivedNoteItems = receivedNoteItems.filter(item => item.quantity > 0);
			this.loader.show(false);
		});
	}

	onGrnChange(e) {
		const grnId = e.value;
		if (this.grn.id !== 0 || grnId == null) {
			return;
		}
		this.loader.show(true);
		this.grnServie.getById(grnId).subscribe(grn => {
			if ( grn.wareHouseId != null ) {
				this.grn.wareHouseId = grn.wareHouseId;
			}
			this.grn.supplierId = grn.supplierId;
			this.grn.returnGoodReceivedNoteId = grn.id;
			const receivedNoteItems = grn.goodReceivedNoteItems.map(item => {
				return {
					id: 0,
					productId: item.productId,
					quantity: item.quantity,
					unitCost: item.unitCost,
					expiredDate: item.expiredDate
				};
			});
			this.grn.goodReceivedNoteItems = receivedNoteItems;
			this.loader.show(false);
		});
	}

	onGrnTypeChange(e) {
		if (this.grnTypeSuspendValueChagned) {
			this.grnTypeSuspendValueChagned = false;
			return;
		}
		if (this.grn.id !== 0) {
			return;
		}
		const value = e.value;
		const previousValue = e.previousValue;
		if (this.grn.purchaseOrderId != null || this.grn.goodReceivedNoteItems.length !== 0) {
			const result = confirm('<i>The current changes will be lost. Do you want to continue it?</i>',
				'');
			result.then((dialogResult) => {
				if (dialogResult) {
					this.grn.purchaseOrderId = null;
					this.grn.returnGoodReceivedNoteId = null;
					this.grn.goodReceivedNoteItems = [];
				}else {
					this.grnTypeSuspendValueChagned = true;
					e.component.option('value', previousValue);
				}
			});
		} else {
			this.grn.purchaseOrderId = null;
			this.grn.returnGoodReceivedNoteId = null;
			this.grn.goodReceivedNoteItems = [];
		}
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

	keyUp(e) {
		console.log(e);
	}

	public backToGrnList() {
		this.router.navigate(['/grn-list']);
	}

	public grnView() {
		this.router.navigate([`grn-view/${this.grn.id}`]);
	}

	private setGrn() {
		this.grn = this.getNewGrn();
		const grnId = this.route.snapshot.paramMap.get('id');

		if ( grnId !== '0' ) {
			this.grnServie.getById(+grnId).subscribe((data: IGrn) => {
				this.grn = data;
			});
		} else {
			this.grn.goodReceivedNoteItems = [];
		}
	}

	private getNewGrn() {
		return { id: 0, supplierId: null, goodReceivedNoteItems: null, wareHouseId: null, purchaseOrderId: null } as IGrn;
	}
}
