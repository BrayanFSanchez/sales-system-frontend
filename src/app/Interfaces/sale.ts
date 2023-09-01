import { SaleDetail } from './sale-detail';

export interface Sale {
  idSale?: number;
  documentNumber?: string;
  paymentType: string;
  registrationDate?: string;
  totalText: string;
  saleDetail: SaleDetail[];
}
