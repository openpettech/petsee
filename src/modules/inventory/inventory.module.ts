import { Module } from '@nestjs/common';

import {
  BrandController,
  StockController,
  StockLedgerController,
  SupplierController,
  WarehouseController,
  ProductController,
} from './controllers';
import {
  BrandService,
  StockLedgerService,
  StockService,
  SupplierService,
  ProductService,
  WarehouseService,
} from './services';

const providers = [
  BrandService,
  StockLedgerService,
  StockService,
  SupplierService,
  ProductService,
  WarehouseService,
];

@Module({
  providers,
  imports: [],
  controllers: [
    BrandController,
    StockController,
    StockLedgerController,
    SupplierController,
    WarehouseController,
    ProductController,
  ],
  exports: [...providers],
})
export class InventoryModule {}
