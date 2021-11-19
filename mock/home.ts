import { Request, Response } from 'express';

const getHomeList = (req: any, res: any) => {
  res.json({
    code: 200,
    data: [
      {
        title: 'Bilibili',
        link: 'www.bilibili.com',
      },
      {
        title: 'Baidu',
        link: 'www.baidu.com',
      },
      {
        title: '中邮消费邮箱',
        link: 'https://mail.youcash.com:5443',
      },
      {
        title: '知识库',
        link: 'https://zyxf-frontend.yuque.com/uc5z3g/satndd',
      },
      {
        title: 'Bilibili',
        link: 'www.bilibili.com',
      },
      {
        title: 'Baidu',
        link: 'www.baidu.com',
      },
      {
        title: '中邮消费邮箱',
        link: 'https://mail.youcash.com:5443',
      },
      {
        title: '知识库知识库知识库知识库',
        link: 'https://zyxf-frontend.yuque.com/uc5z3g/satndd',
      },
      {
        title: 'Bilibili',
        link: 'www.bilibili.com',
      },
      {
        title: 'Baidu',
        link: 'www.baidu.com',
      },
      {
        title: '中邮消费邮箱中邮消费邮箱',
        link: 'https://mail.youcash.com:5443',
      },
      {
        title: '知识库',
        link: 'https://zyxf-frontend.yuque.com/uc5z3g/satndd',
      },
    ],
  });
};

const getMenuList = () => {};

export default {
  'GET /home/list': getHomeList,
  'GET /home/menu': getMenuList,
};
