import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  StreamableFile,
  UseInterceptors,
  Response
} from '@nestjs/common';

import { Transform } from 'stream';

import { plainToInstance } from 'class-transformer';

import { StoreService } from './store.service';
import { StoreTransformer } from './store.transformer';

@Controller('api/stores')
@UseInterceptors(ClassSerializerInterceptor)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getList(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 15,
    @Query('searchQuery') searchQuery?: string,
    @Query('lat') lat?: number,
    @Query('long') long?: number,
    @Query('weekday') weekday: number = new Date().getDay(),
    @Query('startHour') startHour?: string,
    @Query('endHour') endHour?: string,
  ): Promise<StoreTransformer[]> {
    const stores = await this.storeService.getList(offset, limit, searchQuery, lat, long, weekday, startHour, endHour);
    return plainToInstance(StoreTransformer, stores);
  }

  /**
   * this endpoint should export all stores from database as a csv file
   * */
  @Get('export')
  async export(@Response({ passthrough: true }) res) {
    const dbStream = await this.storeService.streamQuery();
    const toCSVTransform = (fields) => new Transform({
      objectMode: true,
      transform: (row, encoding, callback) => {
        let rowAsArr = [];
        for(let i = 0; i < fields.length; i++) {
          let rec = row['store_'+fields[i]];
          rowAsArr.push(rec);
        }
        callback(null, `${rowAsArr.join(',')}\n`);
      }
    });

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="stores.csv"',
    });
    return new StreamableFile(
      dbStream
      .pipe(toCSVTransform(['uuid','name', 'status', 'address', 'url', 'email', 'lat', 'long']))
    );
  }
}
