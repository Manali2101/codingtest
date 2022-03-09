import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Store } from 'server/data/models';
import { StoreRepository } from 'server/data/repositories';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreRepository)
    public readonly storeRepository: StoreRepository,
  ) {}

  getOne(storeUUID: string, relations = []) {
    return this.storeRepository.findOne({
      where: { uuid: storeUUID },
      relations,
    });
  }

  streamQuery() {
    return this.storeRepository.createQueryBuilder('store').stream();
  }

  getList(offset: number, limit: number, searchQuery, lat, long, weekday: number, startHour, endHour): Promise<Store[]> {
    const query = this.storeRepository
      .createQueryBuilder('store')
      .orderBy('store.sortOrder')
      .limit(limit)
      .offset(offset);
    console.log('searchQuery', searchQuery)
   
    searchQuery ? query.where('store.name like :name', { name: `%${searchQuery}%` }) : null;
    (weekday || startHour || endHour) ? query.leftJoinAndSelect('store.hours', 'hour', 'hour.store_id=store.id') : null;
    (weekday)?query.andWhere('hour.weekday = :weekday ', { weekday }):null;
    (startHour)?query.andWhere('hour.from >= :startHour ', { startHour }):null;
    (endHour)?query.andWhere('hour.to <= :endHour ', { endHour }):null;
   
    (lat && long)? query.orderBy(`(  (store.lat-${lat})* (store.lat-${lat})  + (store.long-${long})* (store.long-${long})  )`,):null;
    return query.getMany();
  }
}
