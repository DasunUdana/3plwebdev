import { ISupplier } from './supplier';
import { IProduct } from './product';

export interface IPurchaseOrderDetails {
	id: number;
	status: number;
	poNumber: string;
	note: string;
	supplierId: number;
	supplier: ISupplier;
	wareHouseId?: null;
	wareHouse?: null;
	purchaseOrderItems: IPurchaseOrderDetailsItem[];
	created: Date;
	printed: boolean;
	PrintedDate?: Date;
}

export interface IPurchaseOrderDetailsItem {
	id: number;
	purchaseOrderId: number;
	productId: number;
	product: IProduct;
	quantity: number;
	unitCost: number;
	value: number;
}

export interface IPurchaseOrder {
	id: number;
	status: number;
	poNumber: string;
	created: Date;
	note: string;
	supplierId: number;
	wareHouseId: number;
	printed: boolean;
	PrintedDate?: Date;
	purchaseOrderItems: IPurchaseOrderItem[];
}

export interface IPurchaseOrderItem {
	id: number;
	productId: number;
	quantity: number;
	receivedQuantity: number;
	unitCost: number;
}

export interface ICalculateStorage {
	products: ICalculateStorageProductItem[];
}

export interface ICalculateStorageProductItem {
	productId: number;
	quantity: number;
}

export interface ICalculateStorageResponse {
	totalStorage: number;
}
