import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ISupplierPickupAddress } from '../../../../shared/models/supplier';
import { DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { CityService } from '../../../../shared/services/city.service';
import DevExpress from 'devextreme';
import CustomStore = DevExpress.data.CustomStore;

export interface IPickupAddressModalResponse {
	status: 'success' | 'cancel';
	data: ISupplierPickupAddress;
}

@Component({
	selector: 'supplier-pickup-address-modal',
	templateUrl: './supplier-pickup-address-modal.component.html',
	styleUrls: ['./supplier-pickup-address-modal.component.scss']
})
export class SupplierPickupAddressModalComponent implements OnInit {

	@ViewChild('pickupAddressUpdateForm') form: DxFormComponent;
	@ViewChild('pickupAddressModal') pickupAddressModal: DxPopupComponent;

	@Input() pickupAddress: ISupplierPickupAddress;
	@Input() visible: boolean;

	@Output() response = new EventEmitter<IPickupAddressModalResponse>();

	cityStore: CustomStore;

	constructor(private cityService: CityService) {
		this.cityStore = this.cityService.getCities();
	}

	ngOnInit(): void {
	}

	onOk(event: Event) {
		event.preventDefault();
		if ( this.form.instance.validate().status === 'invalid' ) {
			return;
		}
		this.cityService.getCityById(this.pickupAddress.cityId).subscribe(city => {
			this.pickupAddress.city = {
				id: city.id,
				cityName: city.cityName
			};
			this.response.emit({
				status: 'success',
				data: {
					...this.pickupAddress
				}
			});
			this.form.instance.resetValues();
		});
	}

	onCancel() {
		this.response.emit({
			status: 'cancel',
			data: null
		});
	}

}
