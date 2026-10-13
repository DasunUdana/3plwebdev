export interface IGrn {
	id: number;
	type: number;
	grnNo: string;
	supplierInvoiceNumber: string;
	purchaseOrderId?: number;
	returnGoodReceivedNoteId?: number;
	created: Date;
	supplierId: number;
	wareHouseId: number;
	goodReceivedNoteItems: IGrnItem[];
}

export interface IGrnItem {
	id: number;
	productId: number;
	quantity: number;
	unitCost: number;
	expiredDate?: Date;
}
