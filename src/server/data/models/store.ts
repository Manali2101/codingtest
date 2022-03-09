import { Column, Entity, Generated, Index, OneToMany } from 'typeorm';

import { BaseModel } from './baseModel';
import { StoreHours } from './storeHours';

@Entity({ name: 'stores', synchronize: false })
export class Store extends BaseModel {
  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'tinyint' })
  status: number;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'varchar', length: 200 })
  email: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  lat: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  long: string;

  @Column({ name: 'sort_order', type: 'int', nullable: true })
  sortOrder: number;

  @OneToMany(() => StoreHours, (hours) => hours.store)
  hours: StoreHours[];
}
