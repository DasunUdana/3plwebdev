import * as moment from 'moment';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import DevExpress from 'devextreme';
import { SupplierService } from '../../../shared/services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderHandler } from '../../../shared/utilities/loader.handler';
import { NotifyHandler } from '../../../shared/utilities/notify.handler';
import { WarehouseService } from '../../../shared/services/warehouse.service';
import { ProductService } from '../../../shared/services/product.service';
import CustomStore = DevExpress.data.CustomStore;
import { IDelivery, IDeliveryTracking } from '../../../shared/models/delivery';
import { DeliveryService } from '../../../shared/services/delivery.service';
import { CityService } from '../../../shared/services/city.service';
import { IMetaData } from '../../../shared/models/metadata';
import { AuthService } from '../../../shared/services';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { UpdatedStatusOfTrackingNoProduct } from 'src/app/shared/models/product';
import { StockService } from 'src/app/shared/services/stock.service';

@Component({
	selector: 'app-delivery-transfer-editor',
	templateUrl: './delivery-editor.component.html',
	styleUrls: ['./delivery-editor.component.scss'],
})
export class DeliveryEditorComponent implements OnInit {
	@ViewChild('dxDataGridDeliveryItems') dataGrid: DxDataGridComponent;
	@ViewChild('completeForm') completeForm: DxFormComponent;
	@ViewChild('returnForm') returnForm: DxFormComponent;

	delivery: IDelivery;
	supplierStore: CustomStore;
	warehouseStore: CustomStore;
	productStore: CustomStore;
	cityStore: CustomStore;

	deliveryItemGridValid = true;
	metaData: IMetaData;

	trackingDetailsDataSource: DataSource;

	currentTracking: IDeliveryTracking = {
		id: 0,
		status: 0,
		trackingNumber: null,
		deliveryTrackingItems: [],
	};

	processingPopupVisible = false;
	deletePopupVisible = false;
	dispatchPopupVisible = false;
	returnPopupVisible = false;
	completePopupVisible = false;
	trackingDetailsPopupVisible = false;

	processingFormData = {
		requiredNumberOfTrackingNumber: 0,
	};

	dispatchFormData = {
		wareHouseId: null,
	};

	returnFormData = {
		note: null,
	};

	completeFormData = {};

	customerReturnFormData = {
		note: null,
	};

	updatedStatusOfTrackingNoProduct: UpdatedStatusOfTrackingNoProduct[];
	constructor(
		private supplierService: SupplierService,
		private authService: AuthService,
		private warehouseService: WarehouseService,
		private deliveryService: DeliveryService,
		private productService: ProductService,
		private cityService: CityService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private loader: LoaderHandler,
		private notify: NotifyHandler,
		private cdr: ChangeDetectorRef,
		private stockService: StockService
	) {
		this.onGridKeyUp = this.onGridKeyUp.bind(this);
		this.onEditorPreparing = this.onEditorPreparing.bind(this);
	}

	ngOnInit(): void {
		document.addEventListener('keydown', (event) => {
			this.onGridKeyUp(event);
		});
		this.productStore = this.productService.getProductsWithCode();
		this.supplierStore = this.supplierService.getSuppliers();
		this.warehouseStore = this.warehouseService.getWarehouses();
		this.cityStore = this.cityService.getCities();
		this.activatedRoute.data.subscribe((data) => {
			this.metaData = data.metadata;
		});
		this.setDelivery();
	}

	get canEdit(): boolean {
		if (!this.canOperate()) {
			if (this.delivery.deliveryStatus === 0) {
				return true;
			}else{
				return false;
			}
		}
		if (!this.delivery) {
			return false;
		}
		if (this.delivery.id === 0) {
			return true;
		}
		if (this.delivery.deliveryStatus === 0) {
			return true;
		}
		return false;
	}

	isSupplier() {
		return this.authService.isSupplier;
	}

	handleSubmit(e: Event) {
		e.preventDefault();

		if (!this.deliveryItemGridValid) {
			this.notify.error('Please check the delivery items');
			return;
		}

		if (
			this.delivery.deliveryItems == null ||
			this.delivery.deliveryItems.length == 0
		) {
			this.notify.error(
				'Delivery should have at lease one delivery item'
			);
			return;
		}

		this.loader.show(true);

		if (this.delivery.id !== 0) {
			this.deliveryService
				.updateDelivery(this.delivery)
				.subscribe((data) => {
					this.notify.success('Successfully updated delivery');
					this.delivery = data;
					this.loader.show(false);
				});
			return;
		}

		this.deliveryService.addDelivery(this.delivery).subscribe((data) => {
			this.notify.success('Successfully created delivery');
			this.loader.show(false);
			this.router.navigate(['/deliveries']);
		});
	}

	onRowValidating(e) {
		this.deliveryItemGridValid = e.isValid;
	}

	calcualteTotal(rowData) {
		if (rowData == null) {
			return 0;
		}
		if (!rowData.unitCost || !rowData.quantity) {
			return 0;
		}
		return rowData.unitCost * rowData.quantity;
	}

	public backToDelivery() {
		this.router.navigate(['/deliveries']);
	}

	processing(e) {
		e.event.preventDefault();
		this.processingFormData.requiredNumberOfTrackingNumber = 1;
		this.processingPopupVisible = true;
	}

	handleProcessingForm(e) {
		e.preventDefault();
		this.processingPopupVisible = false;
		this.loader.show(true);
		this.deliveryService
			.markAsProcessing(
				this.delivery.id,
				this.processingFormData.requiredNumberOfTrackingNumber
			)
			.subscribe(() => {
				this.notify.success('Successfully marked as processing');
				this.loader.show(false);
				this.setDelivery();
			});
	}

	dispatch(e) {
		this.dispatchPopupVisible = true;
		const user = this.authService.getUser();
		if (user.wareHouses != null && user.wareHouses.length === 1) {
			this.dispatchFormData.wareHouseId = user.wareHouses[0];
		}
		e.event.preventDefault();
	}

	handleDispatchForm(e) {
		e.preventDefault();
		this.dispatchPopupVisible = false;
		this.loader.show(true);
		this.deliveryService
			.markAsDispatch(this.delivery.id, this.dispatchFormData.wareHouseId)
			.subscribe(() => {
				this.notify.success('Successfully marked as dispatched');
				this.loader.show(false);
				this.setDelivery();
			});
	}

	return(e) {
		this.returnFormData = {
			note: null,
		};
		e.event.preventDefault();
		this.returnPopupVisible = true;
		if (this.returnForm != null) {
			setTimeout(() => {
				this.returnForm.instance.resetValues();
			}, 100);
		}
	}

	handleReturnForm(e) {
		e.preventDefault();
		this.returnPopupVisible = false;
		this.loader.show(true);
		const data = this.returnForm.instance.option('formData');
		const trackingNumbers = Object.getOwnPropertyNames(data);
		const selectedTrackingNumbers = trackingNumbers.filter(
			(trackingNumber) => {
				return data[trackingNumber] === true;
			}
		);
		this.deliveryService
			.markAsReturn(this.delivery.id, selectedTrackingNumbers, data.note)
			.subscribe(() => {
				this.notify.success('Successfully marked as return');
				this.loader.show(false);
				this.setDelivery();
			});
	}

	markAsComplete(e) {
		this.completeFormData = {};
		e.event.preventDefault();
		this.completePopupVisible = true;
		if (this.completeForm != null) {
			setTimeout(() => {
				this.completeForm.instance.resetValues();
			}, 100);
		}
	}

	handleComplete(e) {
		e.preventDefault();
		const data = this.completeForm.instance.option('formData');
		const trackingNumbers = Object.getOwnPropertyNames(data);
		const selectedTrackingNumbers = trackingNumbers.filter(
			(trackingNumber) => {
				return data[trackingNumber];
			}
		);
		this.completePopupVisible = false;
		if (selectedTrackingNumbers.length === 0) {
			this.notify.warning(
				'No any tracking number select for complete this delivery'
			);
			return;
		}
		this.loader.show(true);
		this.deliveryService
			.markAsComplete(this.delivery.id, selectedTrackingNumbers)
			.subscribe(() => {
				this.notify.success('Successfully marked as completed');
				this.setDelivery();
				this.loader.show(false);
			});
	}

	delete(e) {
		e.event.preventDefault();
		this.deletePopupVisible = true;
	}

	handleDeleteForm(e) {
		e.preventDefault();
		this.deletePopupVisible = false;
		this.loader.show(true);
		this.deliveryService.markAsDelete(this.delivery.id).subscribe(() => {
			this.notify.success('Successfully deleted');
			this.loader.show(false);
			this.setDelivery();
		});
	}

	wayBill(e) {
		e.event.preventDefault();
		this.router.navigate([`/waybill/${this.delivery.id}`]);
	}

	canMarkAsProcessing() {
		return this.delivery.deliveryStatus === 0 && this.delivery.id !== 0;
	}

	canMarkAsDispatch() {
		return this.delivery.deliveryStatus === 1;
	}

	canPrintWayBill() {
		return (
			this.delivery.deliveryStatus >= 2 &&
			this.delivery.deliveryStatus !== 7
		);
	}

	canMarkAsComplete() {
		return (
			this.delivery.deliveryStatus === 2 ||
			this.delivery.deliveryStatus === 3
		);
	}

	canMarkAsReturn() {
		return (
			this.delivery.deliveryStatus === 2 ||
			this.delivery.deliveryStatus === 3 ||
			this.delivery.deliveryStatus === 4 ||
			this.delivery.deliveryStatus === 5
		);
	}

	disabledDates(args) {
		const date = args.date;
		return moment().add(-1, 'day') > date;
	}

	onEditorPreparing(e, delivery) {		
		if (e.dataField === 'productId') {
			const standardHandler = e.editorOptions.onValueChanged;
			e.editorOptions.onValueChanged = (editorEvent) => {
				standardHandler(editorEvent);
				this.deliveryService
					.getLatestDeliveryPrice(editorEvent.value)
					.subscribe((product) => {
						e.component.cellValue(
							e.row.rowIndex,
							'unitCost',
							product.unitPrice
						);
						e.component.editCell(e.row.rowIndex, 2);
					});
				this.stockService.getAvailableStockQtyBySupplierId(delivery.supplierId, editorEvent.value).subscribe((data)=>{
					e.component.cellValue(
						e.row.rowIndex,
						'availableStock',
						data
					);
				});
			};
		}
	}

	onGridKeyUp(e) {
		if (e.altKey && e.key === 'a') {
			this.dataGrid.instance.addRow().then(() => {
				this.dataGrid.instance.editCell(0, 0);
			});
		}
	}

	onTrackingSaveChanges(e) {
		let errorMessageArr = [];
		this.delivery.deliveryItems.forEach((item) => {
			const message = this.checkValidQuantity(item.productId);
			if (message) {
				errorMessageArr.push(message);
			}
		});
		
		if (errorMessageArr.length === 0) {
			const unfilledTrackings = this.delivery.deliveryTrackings.filter(trkn => {
				let wholeQuantityOfTrackingNo = 0;
				trkn.deliveryTrackingItems.forEach(itm => wholeQuantityOfTrackingNo += itm.quantity);
				if (wholeQuantityOfTrackingNo === 0){
					return trkn;
				}
			});
			
			if(unfilledTrackings.length === 0){
				this.loader.show(true);
				this.deliveryService
					.mapDeliveryProduct(this.delivery)
					.subscribe((delivery) => {
						this.delivery = delivery;
						this.loader.show(false);
					});
			}else{
				this.notify.error("Make sure to fill up a valid quantity until the last tracking number");
			}
		}else{
			this.notify.error(errorMessageArr.toString());
		}
	}

	updateStatusOfTrknNoProduct(trackingNo, productId) {
		this.updatedStatusOfTrackingNoProduct =
			this.updatedStatusOfTrackingNoProduct.map((trkn) => {
				if (trkn.trackingNo === trackingNo) {
					trkn.productQuantityUpdateInfo =
						trkn.productQuantityUpdateInfo.map((product) => {
							if (product.productId === productId) {
								product.isUpdated = true;
							}
							return product;
						});
				}
				return trkn;
			});
	}

	overrideOnValueChanged(e, tracking) {
		if (e.dataField === 'quantity' && e.parentType === 'dataRow') {
			const defaultValueChangeHandler = e.editorOptions.onValueChanged;
			e.editorOptions.onValueChanged = (args) => {
				if (args.value !== args.previousValue) {
					this.onCellChanged(e, args.value, tracking);
				}
				defaultValueChangeHandler(args);
			};
		}
	}

	isNextTrackingNumberAlreadyUpdated(nextTrackingNo, productId) {
		const nextTrackingInfo = this.updatedStatusOfTrackingNoProduct.find(
			(trkn) => trkn.trackingNo === nextTrackingNo
		);

		return nextTrackingInfo.productQuantityUpdateInfo.find(
			(prod) => prod.productId === productId && prod.isUpdated
		);
	}

	updateQuantityOfNextTrackingNoSpecificProduct(
		trackingNo,
		productId,
		quantity
	) {
		this.delivery.deliveryTrackings = this.delivery.deliveryTrackings.map(
			(trkn) => {
				if (trkn.trackingNumber === trackingNo) {
					trkn.deliveryTrackingItems.forEach((item) => {
						if (item.productId === productId) {
							item.quantity = quantity;
						}
					});
				}
				return trkn;
			}
		);
	}

	checkValidQuantity(productId) {
		const productName = this.delivery.deliveryItems.find(
			(prod) => prod.productId === productId
		).product.name;
		let totalQuantity = this.delivery.deliveryItems.find(
			(item) => item.productId === productId
		).quantity;

		const userFilledQuantityArr = this.delivery.deliveryTrackings.map(
			(trk) => {
				return trk.deliveryTrackingItems.find(
					(product) => product.productId === productId
				).quantity;
			}
		);
		const sumOfQuantity = userFilledQuantityArr.reduce(
			(pre, curr) => pre + curr,
			0
		);
		if (sumOfQuantity > totalQuantity) {
			return `Quantity of ${productName} has exceeded`;
		} else if (sumOfQuantity < totalQuantity) {
			return `Quantity of ${productName} seems invalid. Qty=${sumOfQuantity}`;
		}
	}

	onCellChanged(e, newQuantity, trackingNumber) {
		let totalQuantity = this.delivery.deliveryItems.find(
			(item) => item.productId === e.row.data.productId
		).quantity;

		this.updateStatusOfTrknNoProduct(trackingNumber, e.row.data.productId);

		const indexOfCurrentTrackingNo =
			this.delivery.deliveryTrackings.findIndex(
				(trknNo) => trknNo.trackingNumber === trackingNumber
			);

		if (
			indexOfCurrentTrackingNo <
			this.delivery.deliveryTrackings.length - 1
		) {
			const nextTrackingNo =
				this.delivery.deliveryTrackings[indexOfCurrentTrackingNo + 1]
					.trackingNumber;
			if (
				!this.isNextTrackingNumberAlreadyUpdated(
					nextTrackingNo,
					e.row.data.productId
				)
			) {
				let quantityArr = [];
				if (indexOfCurrentTrackingNo > 0) {
					quantityArr = this.delivery.deliveryTrackings
						.slice(0, indexOfCurrentTrackingNo)
						.map((trk) => {
							return trk.deliveryTrackingItems.find(
								(product) =>
									product.productId === e.row.data.productId
							).quantity;
						});
					quantityArr.push(newQuantity);
				}
				if (indexOfCurrentTrackingNo === 0) {
					quantityArr.push(newQuantity);
				}
				const sumOfQuantity = quantityArr.reduce(
					(pre, curr) => pre + curr,
					0
				);
				setTimeout(() => {
					if (totalQuantity - sumOfQuantity >= 0) {
						this.updateQuantityOfNextTrackingNoSpecificProduct(
							nextTrackingNo,
							e.row.data.productId,
							totalQuantity - sumOfQuantity
						);
					} else {
						this.updateQuantityOfNextTrackingNoSpecificProduct(
							nextTrackingNo,
							e.row.data.productId,
							0
						);						
						this.notify.warning('Entered quantity is invalid');
					}
				}, 300);
			} else {
				this.checkInvalidQuantityAndDisplayWarning(
					e.row.data.productId,
					indexOfCurrentTrackingNo,
					newQuantity,
					totalQuantity
				);
			}
		} else {
			this.checkInvalidQuantityAndDisplayWarning(
				e.row.data.productId,
				indexOfCurrentTrackingNo,
				newQuantity,
				totalQuantity
			);
		}
	}

	checkInvalidQuantityAndDisplayWarning(
		productId,
		indexOfCurrentTrackingNo,
		newQuantity,
		totalQuantity
	) {
		let quantityArr = [];
		quantityArr = this.delivery.deliveryTrackings
			.slice(0, indexOfCurrentTrackingNo)
			.map((trk) => {
				return trk.deliveryTrackingItems.find(
					(product) => product.productId === productId
				).quantity;
			});
		quantityArr.push(newQuantity);
		const sumOfQuantity = quantityArr.reduce((pre, curr) => pre + curr, 0);
		setTimeout(() => {
			if (totalQuantity - sumOfQuantity < 0) {
				this.notify.warning('Entered quantity is invalid');
			}
		}, 300);
	}

	get DispatchedTrackings() {
		if (this.delivery == null || this.delivery.deliveryTrackings == null) {
			return [];
		}
		return this.delivery.deliveryTrackings.filter(
			(item) => item.status === 1
		);
	}

	get ReturnTrackings() {
		if (this.delivery == null || this.delivery.deliveryTrackings == null) {
			return [];
		}
		return this.delivery.deliveryTrackings.filter(
			(item) => item.status === 1 || item.status === 2
		);
	}

	canOperate() {
		return !this.authService.isSupplier;
	}

	showTrackingDetails(e, trackingNumber: string) {
		e.event.preventDefault();
		this.loader.show(true);
		this.deliveryService
			.getTrackingDetails(trackingNumber)
			.subscribe((details) => {
				if (details.isSuccess === '0') {
					this.notify.error('Unable to get tracking details');
					this.loader.show(false);
					return;
				}
				this.trackingDetailsDataSource = new DataSource(details.result);
				this.trackingDetailsPopupVisible = true;
				this.loader.show(false);
			});
	}

	private setDelivery() {
		this.delivery = this.getNewDelivery();

		const deliveryId = this.activatedRoute.snapshot.paramMap.get('id');
		
		if (deliveryId !== '0') {
			this.deliveryService
				.getDeliveryById(+deliveryId)
				.subscribe((data: IDelivery) => {
					this.delivery = data;
					
					this.mapEveryTrknNoProductWithUpdatedStatus(data);
					if(!this.isSupplier() && this.delivery.deliveryTrackings.length > 0){
						this.delivery.deliveryTrackings[0].deliveryTrackingItems =
						this.delivery.deliveryTrackings[0].deliveryTrackingItems.map(
							(trackingItem) => {
								if(trackingItem.quantity === 0 && this.checkValidQuantity(trackingItem.productId)){
									trackingItem.quantity =
									this.delivery.deliveryItems.filter(
										(item) =>
											item.productId ===
											trackingItem.productId
									)[0].quantity;
								}
								return trackingItem;
							}
						);
					}
				});
		}
		else{
			if(this.isSupplier()){
				this.delivery.supplierId = this.authService.getUser().supplierId;
				this.delivery["type"] = 0;
			}
		}
	}

	mapEveryTrknNoProductWithUpdatedStatus(data) {
		this.updatedStatusOfTrackingNoProduct = data.deliveryTrackings.map(
			(trkn, key) => {
				
					const updatedStatusOfProducts = trkn.deliveryTrackingItems.map(
						(item) => {
							// check if the first tracking no was updated during the initial save
							if(key === 0){
								const productIdQty = data.deliveryItems.find(dlvryItm => dlvryItm.productId===item.productId).quantity;
								if(productIdQty === item.quantity){
									return {
										isUpdated: false,
										productId: item.productId,
									};
								}else{
									return {
										isUpdated: true,
										productId: item.productId,
									};
								}
							}
							if(key > 0){
								const isOneOrMoreProductsOfTrknNoUpdated = trkn.deliveryTrackingItems.find(item => item.quantity>0);
								if(isOneOrMoreProductsOfTrknNoUpdated){
									return {
										isUpdated: true,
										productId: item.productId,
									};
								}else{
									return {
										isUpdated: false,
										productId: item.productId,
									};
								}
							}
						}
					);
					return {
						trackingNo: trkn.trackingNumber,
						productQuantityUpdateInfo: updatedStatusOfProducts,
					};
			}
		);
	}

	private getNewDelivery() {
		return {
			id: 0,
			deliveryDate: new Date(),
			deliveryItems: [],
			deliveryStatus: 0,
			supplierId: null,
			wareHouseId: null,
			deliveryCustomer: {},
		} as IDelivery;
	}

	contentReady(e) {
		if (!e.component.getSelectedRowKeys().length) {
			e.component.selectRowsByIndexes(0);
		}
	}

	selectionChanged(e) {	
		setTimeout(() => {
			if(!this.isSupplier()){
				const trackingNoDtl: IDeliveryTracking = e.currentSelectedRowKeys[0];
				const relatedTrknNoInfo = this.updatedStatusOfTrackingNoProduct.find(itm => itm.trackingNo === trackingNoDtl.trackingNumber);
				if(trackingNoDtl.deliveryTrackingItems.find(itm => itm.quantity>0 )){
					e.component.collapseAll(-1);
					e.component.expandRow(e.currentSelectedRowKeys[0]);
				}else if(trackingNoDtl.deliveryTrackingItems.find(itm => itm.quantity === 0 && relatedTrknNoInfo.productQuantityUpdateInfo.find(product => itm.productId === product.productId && product.isUpdated))){
					e.component.collapseAll(-1);
					e.component.expandRow(e.currentSelectedRowKeys[0]);
				}else{
					this.notify.warning('Whole quantity is allocated to previous tracking number/s');
				}
			}
		}, 1200);
	}
}
