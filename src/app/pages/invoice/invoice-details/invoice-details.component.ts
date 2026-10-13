import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getReportUrl } from '../../../shared/utilities/report.helper';

@Component({
	selector: 'app-stock-balance-report',
	templateUrl: './invoice-details.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: [
		'./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {

	title = 'Invoice';
	reportUrl = '';
	hostUrl = getReportUrl();
	invokeAction = 'DXXRDV';

	constructor(private route: ActivatedRoute,
				private router: Router) {
		const id = this.route.snapshot.paramMap.get('id');
		this.reportUrl = `Invoice?id=${id}`;
	}

	ngOnInit(): void {
	}

	backToInvoices() {
		this.router.navigate(['/invoices']);
	}

	beforeRender(e: any) {
		e.args.reportPreview.zoom(1);
	}

}
