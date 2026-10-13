import { Component, ViewEncapsulation } from '@angular/core';
import { DeliveryService } from '../../shared/services/delivery.service';
import { IDeliveryStat } from '../../shared/models/delivery';
import { LoaderHandler } from '../../shared/utilities/loader.handler';
import { ActivatedRoute, Router } from '@angular/router';
import { IMetaData } from '../../shared/models/metadata';
import { IWareHouseStorageInfo } from '../../shared/models/warehouse';
import { WarehouseService } from '../../shared/services/warehouse.service';
import { AuthService } from '../../shared/services';
import * as moment from 'moment';

@Component({
	templateUrl: 'home.component.html',
	styleUrls: ['./home.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class HomeComponent {

	metaData: IMetaData;
	deliveryStat: IDeliveryStat;

	pendingCount: number = 0;
	processingCount: number = 0;
	dispatchedCount: number = 0;
	partiallyCompletedCount: number = 0;
	completedCount: number = 0;
	partiallyReturnCount: number = 0;
	returnCount: number = 0;

	weeklyDeliveryStat: any;
	warehouseStorageInfo: any;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private loader: LoaderHandler,
		private warehouseService: WarehouseService,
		private authService: AuthService,
		private deliveryService: DeliveryService) {
	}

	ngOnInit(): void {
		this.activatedRoute.data.subscribe(data => {
			this.metaData = data.metadata;
		});
		this.loader.show(true);
		this.deliveryService.getDeliveryStat()
			.subscribe(stat => {
				this.deliveryStat = stat;
				this.setWeeklyDeliveryStat();
				this.pendingCount = this.getDayStat(0);
				this.processingCount = this.getDayStat(1);
				this.dispatchedCount = this.getDayStat(2);
				this.partiallyCompletedCount = this.getDayStat(3);
				this.completedCount = this.getDayStat(4);
				this.partiallyReturnCount = this.getDayStat(5);
				this.returnCount = this.getDayStat(6);
				this.loader.show(false);
			});
		this.warehouseService.getWareHouseStorageInfo().subscribe(warehouseStorageInfos => {

			if (this.authService.isSupplier) {
				this.warehouseStorageInfo = [];
				return;
			}

			const user = this.authService.getUser();
			const wareHouses = user.wareHouses;
			this.warehouseStorageInfo = warehouseStorageInfos.filter(item => wareHouses.length === 0
				|| wareHouses.includes(item.wareHouseId)).map(info => {
				return {
					title: info.wareHouseName + ' - ' + info.code,
					spaces: [
						{
							name: 'Used',
							value: info.usedSpace
						},
						{
							name: 'Free',
							value: info.freeSpace
						}
					]
				};
			});
		});
	}

	getDayStat(status: number) {
		if (!this.deliveryStat) {
			return 0;
		}
		return this.deliveryStat.dayStat
			.filter(item => item.status === status)[0].count;
	}

	customizeTooltipMonthlyStat(arg: any) {
		return {
			text: arg.seriesName + ' Count: ' + arg.valueText
		};
	}

	customizePieChartLabel(arg) {
		return (arg.percent * 100).toFixed(3) + '%';
	}

	screen(width) {
		return ( width < 700 ) ? 'sm' : 'lg';
	}

	get isSupplier() {
		return this.authService.isSupplier;
	}

	private setWeeklyDeliveryStat() {
		this.weeklyDeliveryStat = this.deliveryStat.weeklyStat.map(stat => {
			const weeklyStatItem = {
				date: moment(stat.date).format('YYYY/MM/DD')
			};
			stat.deliveryStats.map(deliveryStat => {
				const deliveryStatusName = this.metaData.deliveryStatus.filter(item => {
					return item.id === deliveryStat.status;
				})[0].name;
				weeklyStatItem[deliveryStatusName] = deliveryStat.count;
			});
			return weeklyStatItem;
		});
		console.log(this.weeklyDeliveryStat);
	}
}
