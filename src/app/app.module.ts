import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import {
	FooterModule,
	LoginFormModule
} from './shared/components';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SideNavInnerToolbarModule, SideNavOuterToolbarModule, SingleCardModule } from './layouts';
import { AppInfoService, AuthService, ScreenService } from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { SupplierService } from './shared/services/supplier.service';
import { WarehouseService } from './shared/services/warehouse.service';
import { ProductService } from './shared/services/product.service';
import { MetadataService } from './shared/services/metadata.service';
import { environment } from 'src/environments/environment';
import { ACCESS_TOKEN_KEY } from './shared/constants/common';
import { CityService } from './shared/services/city.service';
import { LoaderHandler } from './shared/utilities/loader.handler';
import { NotifyHandler } from './shared/utilities/notify.handler';
import { MetadataResolver } from './shared/resolvers/metadata.resolver';
import { PurchaseOrderService } from './shared/services/purchaseorder.service';
import { GrnService } from './shared/services/grn.service';
import { StockService } from './shared/services/stock.service';
import { StockTransferService } from './shared/services/stocktransfer.service';
import { DeliveryService } from './shared/services/delivery.service';
import { InvoiceService } from './shared/services/invoice.service';
import { AppHttpInterceptor } from './shared/utilities/AppHttpInterceptor';
import { LogService } from './shared/services/log.service';

export function tokenGetter() {
	return localStorage.getItem(ACCESS_TOKEN_KEY);
}

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		SideNavOuterToolbarModule,
		SideNavInnerToolbarModule,
		FooterModule,
		LoginFormModule,
		UnauthenticatedContentModule,
		AppRoutingModule,
		JwtModule.forRoot({
			config: {
				tokenGetter,
				allowedDomains: [environment.apiDomainName, environment.localApiDomainName]
			},
		})
	],
	providers: [
		LoaderHandler,
		NotifyHandler,
		AuthService,
		ScreenService,
		AppInfoService,
		SupplierService,
		WarehouseService,
		ProductService,
		CityService,
		PurchaseOrderService,
		GrnService,
		StockService,
		StockTransferService,
		MetadataService,
		MetadataResolver,
		DeliveryService,
		InvoiceService,
		LogService,
		{ provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true }
	],
	exports: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
