import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import DevExpress from 'devextreme';

import { ISupplier, ISupplierPickupAddress } from 'src/app/shared/models/supplier';
import { CityService } from 'src/app/shared/services/city.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { LoaderHandler } from 'src/app/shared/utilities/loader.handler';
import { ModelHelper } from 'src/app/shared/utilities/model.helper';
import { NotifyHandler } from 'src/app/shared/utilities/notify.handler';
import { IPickupAddressModalResponse } from './supplier-pickup-address-modal/supplier-pickup-address-modal.component';
import CustomStore = DevExpress.data.CustomStore;
import { IMetaData } from '../../../shared/models/metadata';

@Component({
	encapsulation: ViewEncapsulation.None,
	templateUrl: 'supplier-update.component.html',
	styleUrls: ['./supplier-update.component.scss']
})

export class SupplierUpdateComponent {

	public metaData: IMetaData;
	public supplier: ISupplier;
	public cityStore: CustomStore;

	public displayPickupAddressModal = false;
	public currentSupplierPickupAddress: ISupplierPickupAddress = null;
	public currentEditSupplierPickupAddressIndex: number | null = null;

	constructor(
		private supplierService: SupplierService,
		private cityService: CityService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private loader: LoaderHandler,
		private notify: NotifyHandler,
		private cdr: ChangeDetectorRef
	) {
		this.cityStore = this.cityService.getCities();
		this.setSupplier();
	}

	ngOnInit(): void {
		this.activatedRoute.data.subscribe(data => {
			this.metaData = data.metadata;
		});
	}

	public backToSuppliers() {
		this.router.navigate(['/suppliers']);
	}

	public getPickupAddressDisplayStrinng(pickupAddress: ISupplierPickupAddress) {
		const text = pickupAddress.firstName + ' ' + pickupAddress.lastName + ', ' +
			pickupAddress.addressLine1 + ' ' + pickupAddress.addressLine2 + ' ' +
			pickupAddress.city.cityName + ' ' + pickupAddress.postalCode;
		return text;
	}

	public updateSupplier() {
		this.loader.show(true);
		this.supplierService.updateSupplier(this.supplier).subscribe((response: ISupplier) => {
			this.notify.success('Supplier updated successfully');
			this.loader.show(false);
			this.router.navigate(['/suppliers']);
		});
	}

	public addSupplier() {
		this.loader.show(true);
		this.supplierService.addSupplier(this.supplier).subscribe((response: ISupplier) => {
			this.notify.success('Supplier added successfully');
			this.loader.show(false);
			this.router.navigate(['/suppliers']);
		});
	}

	public handleSubmit(e: any) {
		e.preventDefault();
		if ( this.supplier.id === 0 ) {
			this.addSupplier();
		} else {
			this.updateSupplier();
		}
	}

	public addPickupAddress() {
		this.currentEditSupplierPickupAddressIndex = null;
		this.showPickupAddressModel(ModelHelper.newSupplierPickupAddress());
	}

	public updatePickupAddress($event) {
		this.currentEditSupplierPickupAddressIndex = $event.itemIndex;
		this.showPickupAddressModel({ ...this.supplier.pickupAddress[$event.itemIndex] });
	}

	public supplierPickupAddressModelResponse(response: IPickupAddressModalResponse) {
		if ( response.status === 'cancel' ) {
			this.displayPickupAddressModal = false;
			this.currentSupplierPickupAddress = null;
			this.currentEditSupplierPickupAddressIndex = null;
			return;
		}
		if ( response.status === 'success' ) {
			this.displayPickupAddressModal = false;
			if ( this.currentEditSupplierPickupAddressIndex === null ) {
				this.supplier.pickupAddress.push(response.data);
			} else {
				this.supplier.pickupAddress[this.currentEditSupplierPickupAddressIndex] = response.data;
			}
			this.currentEditSupplierPickupAddressIndex = null;
			this.currentSupplierPickupAddress = null;
			return;
		}
	}

	private showPickupAddressModel(supplierPickupAddress: ISupplierPickupAddress) {
		this.currentSupplierPickupAddress = supplierPickupAddress;
		this.displayPickupAddressModal = true;
	}

	private setSupplier() {
		this.supplier = ModelHelper.newSupplier();
		const supplierId = this.activatedRoute.snapshot.paramMap.get('id');

		if ( supplierId !== '0' ) {
			this.supplierService.getSupplierById(+supplierId).subscribe((data: ISupplier) => {
				this.supplier = data;
			});
		}
	}
}

