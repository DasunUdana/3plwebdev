import { IAddress } from './address';
import { IProduct } from './product';

export interface ISupplier {
	id: number;
	code: string;
	active: boolean;
	supplierName: string;
	businessRegistrationId: string;
	vatNumber: string;
	address: IAddress;
	contact: IContact;
	invoicePolicy: string;
	returnPolicy: string;
	supplierCharges: ISupplierCharges;
	pickupAddress: ISupplierPickupAddress[];
	products: IProduct[];
}

export interface IContact {
	contactPerson: string;
	phone: string;
	mobile: string;
	email: string;
}

export interface ISupplierCharges {
	allocatedUnits: number;
	storageChargePerUnit: number;
	additionalChargePerUnitPrice: number;
	handlingCharge: number;
}

export interface ISupplierPickupAddress extends IAddress {
	id: number;
}

export interface ICreateAccount {
	supplierId: number;
	username: string;
	email: string;
	active: boolean;
	password: string;
	confirmPassword: string;
}

export interface ITotalStorageByWareHouse {
	wareHouseId: number;
	wareHouseName: string;
	wareHouseCode: string;
	totalStorage: number;
}

export interface ISupplierStorage {
	allocatedStorage: number;
	totalStorage: number;
	totalStorageByWareHouses: ITotalStorageByWareHouse[];
}

