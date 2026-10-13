export interface IStoreType {
	id: number;
	name: string;
}

export interface IMassUnit {
	id: number;
	name: string;
}

export interface IDistanceUnit {
	id: number;
	name: string;
}

export interface IStockAdjustmentType {
	id: number;
	name: string;
}

export interface IGrnType {
	id: number;
	name: string;
}

export interface IDeliveryStatus {
	id: number;
	name: string;
}

export interface IDeliveryType {
	id: number;
	name: string;
}

export interface IUnitOfMeasure {
	id: number;
	code: string;
	description: string;
}

export interface IPurchaseOrderType {
	id: number;
	name: string;
}

export interface ITrackingStatus {
	id: number;
	name: string;
}

export interface ITaxType {
	id: number;
	name: string;
}

export interface IMetaData {
	storeTypes: IStoreType[];
	massUnits: IMassUnit[];
	distanceUnits: IDistanceUnit[];
	stockAdjustmentTypes: IStockAdjustmentType[];
	grnTypes: IGrnType[];
	deliveryStatus: IDeliveryStatus[];
	deliveryTypes: IDeliveryType[];
	unitOfMeasures: IUnitOfMeasure[];
	purchaseOrderStatus: IPurchaseOrderType[];
	trackingStatus: ITrackingStatus[];
	taxTypes: ITaxType[];
	roles: string[];
}
