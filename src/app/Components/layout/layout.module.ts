import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UserComponent } from './Pages/user/user.component';
import { ProductComponent } from './Pages/product/product.component';
import { SaleComponent } from './Pages/sale/sale.component';
import { SalesHistoryComponent } from './Pages/sales-history/sales-history.component';
import { ReportComponent } from './Pages/report/report.component';
import { SharedModule } from '../../Reusable/shared/shared.module';
import { ModalUserComponent } from './Modals/modal-user/modal-user.component';
import { ModalProductComponent } from './Modals/modal-product/modal-product.component';
import { ModalSaleDetailComponent } from './Modals/modal-sale-detail/modal-sale-detail.component';

@NgModule({
  declarations: [
    DashBoardComponent,
    UserComponent,
    ProductComponent,
    SaleComponent,
    SalesHistoryComponent,
    ReportComponent,
    ModalUserComponent,
    ModalProductComponent,
    ModalSaleDetailComponent,
  ],
  imports: [CommonModule, LayoutRoutingModule, SharedModule],
})
export class LayoutModule {}
