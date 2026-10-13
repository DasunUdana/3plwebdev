import { Component, OnInit } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { LogService } from '../../../shared/services/log.service';

@Component({
	selector: 'app-log-view',
	templateUrl: './log-view.component.html',
	styleUrls: ['./log-view.component.scss']
})
export class LogViewComponent implements OnInit {

	auditLogDataSource: CustomStore;
	eventsDataSource: CustomStore;

	constructor(private logService: LogService) {
		this.auditLogDataSource = this.logService.getAuditLogs();
		this.eventsDataSource = this.logService.getEvents();
	}

	ngOnInit(): void {
	}

}
