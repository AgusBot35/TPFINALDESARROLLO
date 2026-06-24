import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Global, Module } from '@nestjs/common';

import { CategoryEntity } from './entities/category.entity';

import { CATEGORIES_REPOSITORY } from './repositories/categories.repository';
import { TypeOrmCategoriesRepository } from './repositories/typeorm-categories.repository';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';

import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    forwardRef(() => ProductsModule),
    AuthModule
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: CATEGORIES_REPOSITORY,
      useClass: TypeOrmCategoriesRepository
    }
  ],
  exports: [CategoriesService, CATEGORIES_REPOSITORY],
})
export class CategoriesModule {}
