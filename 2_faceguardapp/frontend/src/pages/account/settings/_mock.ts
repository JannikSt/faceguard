// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import city from './geographic/city.json';
import province from './geographic/province.json';

function getProvince(_: Request, res: Response) {
  return res.json(province);
}

function getCity(req: Request, res: Response) {
  return res.json(city[req.params.province]);
}
// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: 'Philipp',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'philipp.test@tum.com',
    signature: 'Phili',
    title: 'Mister',
    group: 'student－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'Germany',
    geographic: {
      province: {
        label: 'Bavaria',
        key: '330000',
      },
      city: {
        label: 'Munich',
        key: '330100',
      },
    },
    address: 'Arcisstreet 21',
    phone: '0752-26882135',
  },
  'GET  /api/geographic/province': getProvince,
  'GET  /api/geographic/city/:province': getCity,
};
