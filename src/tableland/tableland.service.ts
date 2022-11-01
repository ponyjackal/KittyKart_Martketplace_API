import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Connection } from '@tableland/sdk';

@Injectable()
export class TablelandService {
  constructor(
    @Inject('TABLELAND_CONNECTION')
    private readonly tbl: Connection,
    private httpService: HttpService,
  ) {}

  async getKartsByAddress(address: string) {
    `SELECT%20json_object%28%27id%27%2C%20id%2C%20%27name%27%2C%20name%2C%20%27description%27%2C%20description%2C%20%27image%27%2C%20image%2C%20%27external_url%27%2C%20external_url%2C%20%27animation_url%27%2C%20animation_url%2C%20%27attributes%27%2C%20json_group_array%28json_object%28%27display_type%27%2C%20display_type%2C%20%27trait_type%27%2C%20trait_type%2C%20%27value%27%2C%20value%29%29%29%20FROM%20kitty_kart_test_5_866%20LEFT%20JOIN%20kitty_asset_test_attribute_5_868%20ON%20kitty_kart_test_5_866.id%20%3D%20kitty_asset_test_attribute_5_868.kart_id%20WHERE%20kitty_kart_test_5_866.owner%3D%270x9a4c14d8d81d7dab564e146c98c9ef9a140ae12f%27%20GROUP%20BY%20id%3B`;
    const query = `SELECT json_object('id', id, 'name', name, 'description', description, 'image', image, 'external_url', external_url, 'animation_url', animation_url, 'attributes', json_group_array(json_object('display_type', display_type, 'trait_type', trait_type, 'value', value))) FROM ${
      process.env.TABLELAND_KART_METADATA_TABLE
    } LEFT JOIN ${process.env.TABLELAND_ASSET_ATTRIBUTE_TABLE} ON ${
      process.env.TABLELAND_KART_METADATA_TABLE
    }.id = ${process.env.TABLELAND_ASSET_ATTRIBUTE_TABLE}.kart_id WHERE ${
      process.env.TABLELAND_KART_METADATA_TABLE
    }.owner='${address.toLowerCase()}' GROUP BY id;`;

    console.log(
      'query',
      process.env.TABLELAND_URL + encodeURI(query) + '&mode=list',
    );
    /** using tableland sdk */
    // const result = await this.tbl.read(query);
    /** using httpService */
    const result = await this.httpService.axiosRef.get(
      process.env.TABLELAND_URL + encodeURI(query) + '&mode=list',
    );

    console.log('karts', result);
    return result;
  }

  async getAssetsByAddress(address: string) {
    const query = `SELECT json_object('id', id, 'name', name, 'description', description, 'image', image, 'external_url', external_url, 'animation_url', animation_url, 'attributes', json_group_array(json_object('display_type', display_type, 'trait_type', trait_type, 'value', value))) FROM ${
      process.env.TABLELAND_ASSET_METADATA_TABLE
    } LEFT JOIN ${process.env.TABLELAND_ASSET_ATTRIBUTE_TABLE} ON ${
      process.env.TABLELAND_ASSET_METADATA_TABLE
    }.id = ${process.env.TABLELAND_ASSET_ATTRIBUTE_TABLE}.kart_id WHERE ${
      process.env.TABLELAND_ASSET_METADATA_TABLE
    }.owner='${address.toLowerCase()}' GROUP BY id;`;

    console.log(
      'query',
      process.env.TABLELAND_URL + encodeURI(query) + '&mode=list',
    );
    /** using tableland sdk */
    // const result = await this.tbl.read(query);
    /** using httpService */
    const result = await this.httpService.axiosRef.get(
      process.env.TABLELAND_URL + encodeURI(query) + '&mode=list',
    );

    console.log('assets', result);
    return result;
  }
}
