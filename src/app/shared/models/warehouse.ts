import { IAddress } from './address';

export interface IWarehouse {
	id: number;
	code: string;
	name: string;
	address: IAddress;
	active: boolean;
	height: number;
	width: number;
	length: number;
	storageCapacity: number;
}

export interface IWareHouseStorageInfo {
	wareHouseId: number;
	code: string;
	wareHouseName: string;
	storageCapacity: number;
	usedSpace: number;
	freeSpace: number;
}
