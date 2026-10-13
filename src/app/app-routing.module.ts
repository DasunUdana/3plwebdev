import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
	DevExtremeModule,
	DxButtonModule,
	DxCheckBoxModule,
	DxDataGridModule,
	DxFormModule,
	DxListModule,
	DxLoadIndicatorModule,
	DxPopupModule,
	DxSelectBoxModule,
	DxTextAreaModule, DxTextBoxModule,
	DxToastModule
} from 'devextreme-angular';
import { DxReportViewerModule } from 'devexpress-reporting-angular';

import {
	LoginFormComponent,
} from './shared/components';

import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { SupplierListComponent } from './pages/suppliers/supplier-list/supplier-list.component';
import {
	CreateAccountPopupComponent
} from './pages/suppliers/components/create-account-popup/create-account-popup.component';
import { SupplierDetailsComponent } from './pages/suppliers/supplier-details/supplier-details.component';
import { WarehouseListComponent } from './pages/warehouses/warehouse-list/warehouse-list.component';
import { SupplierUpdateComponent } from './pages/suppliers/supplier-update/supplier-update.component';
import { WarehouseUpdateComponent } from './pages/warehouses/warehouse-update/warehouse-update.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductUpdateComponent } from './pages/products/product-update/product-update.component';
import { PurchaseOrderListComponent } from './pages/purchase-order/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderUpdateComponent } from './pages/purchase-order/purchase-order-update/purchase-order-update.component';
import { SupplierPickupAddressModalComponent } from './pages/suppliers/supplier-update/supplier-pickup-address-modal/supplier-pickup-address-modal.component';
import { InvoiceListComponent } from './pages/invoice/invoice-list/invoice-list.component';

import { MetadataResolver } from './shared/resolvers/metadata.resolver';
import { GrnEditorComponent } from './pages/grn/grn-editor/grn-editor.component';
import { GrnListComponent } from './pages/grn/grn-list/grn-list.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { ProductStocksComponent } from './pages/products/components/product-stocks/product-stocks.component';
import { ProductStockAdjustmentsComponent } from './pages/products/components/product-stock-adjustments/product-stock-adjustments.component';
import { StockTransferListComponent } from './pages/stock-transfer/stock-transfer-list/stock-transfer-list.component';
import { StockTransferEditorComponent } from './pages/stock-transfer/stock-transfer-editor/stock-transfer-editor.component';
import { DeliveryListComponent } from './pages/delivery/delivery-list/delivery-list.component';
import { DeliveryEditorComponent } from './pages/delivery/delivery-editor/delivery-editor.component';
import { ReportViewerComponent } from './pages/report/report-viewer/report-viewer.component';
import { InvoiceDetailsComponent } from './pages/invoice/invoice-details/invoice-details.component';
import { UserListComponent } from './pages/user/user-list/user-list.component';
import { UserUpdateComponent } from './pages/user/user-update/user-update.component';
import { WaybillComponent } from './pages/delivery/waybill/waybill.component';
import { GrnViewComponent } from './pages/grn/grn-view/grn-view.component';
import { TransferStockPopupComponent } from './pages/products/components/transfer-stock-popup/transfer-stock-popup.component';
import { PurchaseOrderPrintComponent } from './pages/purchase-order/purchase-order-print-viewer/purchase-order-print.component';
import { ReportListComponent } from './pages/report/report-list/report-list.component';
import { LogViewComponent } from './pages/logs/log-view/log-view.component';


const routes: Routes = [
	{
		path: 'login-form',
		component: LoginFormComponent
	},
	{
		path: 'home',
		component: HomeComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'suppliers',
		component: SupplierListComponent,
		canActivate: [AuthGuardService]
	},
	{
		path: 'supplier/:id',
		component: SupplierUpdateComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'supplier/view/:id',
		component: SupplierDetailsComponent,
		canActivate: [AuthGuardService]
	},
	{
		path: 'warehouses',
		component: WarehouseListComponent,
		canActivate: [AuthGuardService]
	},
	{
		path: 'warehouse/:id',
		component: WarehouseUpdateComponent,
		canActivate: [AuthGuardService]
	},
	{
		path: 'products',
		component: ProductListComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'product/:id',
		component: ProductUpdateComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'product/product-details/:id',
		component: ProductDetailsComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'purchase-orders',
		component: PurchaseOrderListComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'purchase-order/:id',
		component: PurchaseOrderUpdateComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'purchase-order-print-view/:id',
		component: PurchaseOrderPrintComponent,
		canActivate: [AuthGuardService]
	},
	{
		path: 'grn/:id',
		component: GrnEditorComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'grn-list',
		component: GrnListComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'grn-view/:id',
		component: GrnViewComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'stock-transfers',
		component: StockTransferListComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'stock-transfer/:id',
		component: StockTransferEditorComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'deliveries',
		component: DeliveryListComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'delivery/:id',
		component: DeliveryEditorComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'waybill/:id',
		component: WaybillComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'reports',
		component: ReportListComponent,
		canActivate: [AuthGuardService],
	},
	{
		path: 'report/view/:name',
		component: ReportViewerComponent,
		canActivate: [AuthGuardService],
	},
	{
		path: 'invoices',
		component: InvoiceListComponent,
		canActivate: [AuthGuardService],
	},
	{
		path: 'invoice/:id',
		component: InvoiceDetailsComponent,
		canActivate: [AuthGuardService],
	},
	{
		path: 'users',
		component: UserListComponent,
		canActivate: [AuthGuardService],
	},
	{
		path: 'user/:id',
		component: UserUpdateComponent,
		canActivate: [AuthGuardService],
		resolve: {
			metadata: MetadataResolver
		}
	},
	{
		path: 'logs',
		component: LogViewComponent,
		canActivate: [AuthGuardService]
	},
	{
		path: '**',
		redirectTo: 'home'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { useHash: false }),
		CommonModule,
		DxDataGridModule,
		DxFormModule,
		DxButtonModule,
		DxToastModule,
		DxTextAreaModule,
		DxLoadIndicatorModule,
		DxListModule,
		DxPopupModule,
		DxSelectBoxModule,
		DxCheckBoxModule,
		DxTextBoxModule,
		DxReportViewerModule,
		DevExtremeModule
	],
	providers: [AuthGuardService],
	exports: [RouterModule, SupplierPickupAddressModalComponent],
	declarations: [
		HomeComponent,
		ProfileComponent,
		TasksComponent,
		SupplierListComponent,
		SupplierUpdateComponent,
		WarehouseListComponent,
		WarehouseUpdateComponent,
		SupplierPickupAddressModalComponent,
		ProductListComponent,
		ProductUpdateComponent,
		ProductDetailsComponent,
		PurchaseOrderListComponent,
		PurchaseOrderUpdateComponent,
		PurchaseOrderPrintComponent,
		GrnEditorComponent,
		GrnListComponent,
		ProductStocksComponent,
		ProductStockAdjustmentsComponent,
		StockTransferListComponent,
		StockTransferEditorComponent,
		DeliveryListComponent,
		DeliveryEditorComponent,
		ReportViewerComponent,
		InvoiceListComponent,
		InvoiceDetailsComponent,
		UserListComponent,
		UserUpdateComponent,
		WaybillComponent,
		GrnViewComponent,
		CreateAccountPopupComponent,
		SupplierDetailsComponent,
		TransferStockPopupComponent,
		ReportListComponent,
		LogViewComponent
	]
})
export class AppRoutingModule {
}
