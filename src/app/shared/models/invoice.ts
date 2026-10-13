export interface IInvoiceItem {
	id: number;
	date?: Date;
	type: number;
	description: string;
	rate: number;
	quantity: number;
}

export interface IInvoice {
	id: number;
	from: Date;
	to: Date;
	invoiceNo: string;
	supplierId: number;
	paid: boolean;
	invoiceItems: IInvoiceItem[];
	subTotal: number;
	taxPercentage: number;
	tax: number;
	total: number;
}
