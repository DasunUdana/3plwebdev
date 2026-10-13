import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { confirm } from 'devextreme/ui/dialog';
import DevExpress from 'devextreme';
import { SupplierService } from '../../../shared/services/supplier.service';
import { IMetaData } from '../../../shared/models/metadata';
import { MetadataService } from '../../../shared/services/metadata.service';
import CustomStore = DevExpress.data.CustomStore;
import { InvoiceService } from '../../../shared/services/invoice.service';
import { LoaderHandler } from '../../../shared/utilities/loader.handler';
import { NotifyHandler } from '../../../shared/utilities/notify.handler';
import { DxDataGridComponent } from 'devextreme-angular';
import { IInvoice, IInvoiceItem } from '../../../shared/models/invoice';
import { AuthService } from '../../../shared/services';


@Component({
	templateUrl: 'invoice-list.component.html',
	styleUrls: ['./invoice-list.component.scss']
})

export class InvoiceListComponent implements OnInit {

	@ViewChild('grid') grid: DxDataGridComponent;

	metaData: IMetaData;
	invoiceStore: CustomStore;
	supplierStore: CustomStore;

	currentInvoice: IInvoice;
	currentInvoiceItems: IInvoiceItem[];
	showManualChargePopup = false;

	constructor(
		private invoiceService: InvoiceService,
		private metadataService: MetadataService,
		private supplierService: SupplierService,
		private authService: AuthService,
		private loader: LoaderHandler,
		private notify: NotifyHandler,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		this.markAsPaid = this.markAsPaid.bind(this);
		this.manualCharge = this.manualCharge.bind(this);
		this.canAddManualCharges = this.canAddManualCharges.bind(this);
		this.canMarkAsPaid = this.canMarkAsPaid.bind(this);
	}

	ngOnInit(): void {
		this.activatedRoute.data.subscribe(data => {
			this.metaData = data.metadata;
		});
		this.invoiceStore = this.invoiceService.getInvoices();
		this.supplierStore = this.supplierService.getSuppliers();
		this.viewInvoice = this.viewInvoice.bind(this);
	}

	markAsPaid(e): void {
		e.event.preventDefault();
		const result = confirm("<i>Are you sure you want mark this invoice as paid?</i>", "Mark as paid");
		result.then((dialogResult) => {
			if (dialogResult) {
				this.loader.show(false);
				this.invoiceService.markAsPaid(e.row.data.id).subscribe(() => {
					this.loader.show(false);
					this.notify.success('Successfully marked as paid');
					this.grid.instance.refresh();
				});
			}
		});
	}

	viewInvoice(e) {
		e.event.preventDefault();
		this.router.navigate(['/invoice/' + e.row.data.id]);
	}

	manualCharge(e) {
		e.event.preventDefault();
		this.loader.show(true);
		this.invoiceService.getInvoiceById(e.row.data.id).subscribe(invoice => {
			this.currentInvoice = invoice;
			this.currentInvoiceItems = invoice.invoiceItems.filter(i => i.type === 3);
			this.loader.show(false);
			this.showManualChargePopup = true;
		});
	}

	calcualteTotal(rowData) {
		if ( rowData == null ) {
			return 0;
		}
		if ( ! (rowData.rate) || ! (rowData.quantity) ) {
			return 0;
		}
		return rowData.rate * rowData.quantity;
	}

	saveManualChanges() {
		this.loader.show(true);
		this.invoiceService.updateInvoice(this.currentInvoice.id, this.currentInvoiceItems.map(item => {
			return {
				description: item.description,
				rate: item.rate,
				quantity: item.quantity,
				type: 3,
				date: null,
				id: item.id
			};
		})).subscribe(() => {
			this.notify.success('Successfully saved the changes of invoice');
			this.loader.show(false);
			this.showManualChargePopup = false;
		});
	}

	canMarkAsPaid (e) {
		return !e.row.data.paid && !this.isSupplier();
	}

	canAddManualCharges(e) {
		return !this.isSupplier() && !e.row.data.paid;
	}

	isSupplier() {
		return this.authService.isSupplier;
	}
}

