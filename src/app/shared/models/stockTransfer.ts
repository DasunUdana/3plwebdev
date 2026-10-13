import { IWarehouse } from './warehouse';
import { IProduct } from './product';

export interface IProductStockTransfer {
	transferType: string;
	wareHouseId: number;
	productId: number;
	quantity: number;
	damageQuantity: number;
	unitCost: number;
	trackingNumber: string;
	expiredDate?: Date;
	note: string;
}

export interface IStockTransfer {
	id: number;
	stockTransferNumber: string;
	created: Date;
	updated: Date;
	toWareHouseId: number;
	toWareHouse: IWarehouse;
	fromWareHouseId: number;
	fromWareHouse: IWarehouse;
	reason: string;
	stockTransferItems: IStockTransferItem[];
}

export interface IStockTransferItem {
	id: number;
	productId: number;
	product: IProduct;
	quantity: number;
	unitCost: number;
	expiredDate: Date;
}
