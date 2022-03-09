import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseModel } from './baseModel';
import { Store } from './store';

@Entity({ name: 'store_hours', synchronize: false })
export class StoreHours extends BaseModel {
  @Column({ type: 'tinyint' })
  weekday: number;

  @Column({ type: 'time' })
  from: string;

  @Column({ type: 'time' })
  to: string;

  @ManyToOne(() => Store, (store) => store.hours)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ type: 'tinyint' })
  type: number;
}
