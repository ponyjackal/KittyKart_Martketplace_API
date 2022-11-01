import { Injectable, Inject } from '@nestjs/common';
import { Connection } from '@tableland/sdk';
import { env } from 'process';

@Injectable()
export class TablelandService {
  constructor(
    @Inject('TABLELAND_CONNECTION')
    private readonly tbl: Connection,
  ) {}

  async getKartsByAddress(address: string) {
    const result = await this.tbl.read(
      `SELECT json_object('id', id, 'name', name, 'description', description, 'image', image, 'external_url', external_url, 'animation_url', animation_url, 'attributes', json_group_array(json_object('display_type', display_type, 'trait_type', trait_type, 'value', value))) FROM ${
        process.env.TABLELAND_KART_METADATA_TABLE
      } LEFT JOIN ${process.env.TABLELAND_ASSET_ATTRIBUTE_TABLE} ON ${
        process.env.TABLELAND_KART_METADATA_TABLE
      }.id = ${process.env.TABLELAND_ASSET_ATTRIBUTE_TABLE}.kart_id WHERE ${
        process.env.TABLELAND_KART_METADATA_TABLE
      }.owner='${address.toLowerCase()}' GROUP BY id;`,
    );

    return result;
  }

  async getAssetsByAddress(address: string) {
    const result = await this.tbl.read(
      `SELECT json_object('id', id, 'name', name, 'description', description, 'image', image, 'external_url', external_url, 'animation_url', animation_url, 'attributes', json_group_array(json_object('display_type', display_type, 'trait_type', trait_type, 'value', value))) FROM ${
        process.env.TABLELAND_ASSET_METADATA_TABLE
      } LEFT JOIN ${process.env.TABLELAND_ASSET_ATTRIBUTE_TABLE} ON ${
        process.env.TABLELAND_ASSET_METADATA_TABLE
      }.id = ${process.env.TABLELAND_ASSET_ATTRIBUTE_TABLE}.kart_id WHERE ${
        process.env.TABLELAND_ASSET_METADATA_TABLE
      }.owner='${address.toLowerCase()}' GROUP BY id;`,
    );

    return result;
  }
}
