import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductEntity } from './entities/product.entity';

import { PRODUCTS_REPOSITORY } from './repositories/products.repository';
import { TypeOrmProductsRepository } from './repositories/typeorm-products.repository';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';

import { CategoriesModule } from '../categories/categories.module';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(() => CategoriesModule),
    AuthModule
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCTS_REPOSITORY,
      useClass: TypeOrmProductsRepository
    },
  ],
  exports: [ProductsService, PRODUCTS_REPOSITORY],
})
export class ProductsModule {}