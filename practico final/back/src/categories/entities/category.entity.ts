import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ProductEntity } from "../../products/entities/product.entity";

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    name!: string;

    @Column({ type:'varchar', length: 255, nullable: true })
    description!: string | null;

    @OneToMany(() => ProductEntity, (product) => product.category)
    products!: ProductEntity[];
}