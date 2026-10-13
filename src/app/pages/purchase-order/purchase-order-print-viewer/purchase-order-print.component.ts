import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrderService } from '../../../shared/services/purchaseorder.service';
import { getReportUrl } from '../../../shared/utilities/report.helper';

@Component({
	selector: 'app-stock-balance-report',
	templateUrl: './purchase-order-print.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./purchase-order-print-component.scss']
})
export class PurchaseOrderPrintComponent implements OnInit {

	title = 'Purchase Order';
	reportUrl = '';
	hostUrl = getReportUrl();
	invokeAction = 'DXXRDV';

	constructor(private route: ActivatedRoute,
				private router: Router,
				private purchaseOrderService: PurchaseOrderService) {
		const id = this.route.snapshot.paramMap.get('id');
		this.reportUrl = `PurchaseOrder?id=${id}`;
	}

	ngOnInit(): void {
		this.purchaseOrderService.markAsPrinted(+this.route.snapshot.paramMap.get('id')).subscribe(() => {

		});
	}

	beforeRender(e: any) {
		e.args.reportPreview.zoom(1);
	}

}
