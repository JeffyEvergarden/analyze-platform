import React, { useState, useEffect, useRef } from 'react';
import { history, Link } from 'umi';
import { ConfigProvider } from 'antd';
import Header from '../components/common/header';
import { UsergroupDeleteOutlined, ApartmentOutlined, UserOutlined } from '@ant-design/icons';
import style from '../style.less';
import style2 from './style.less';

import zhCN from 'antd/lib/locale/zh_CN';

// 统一门户-菜单管理

const MenuHome: React.FC<any> = (props: any) => {
  const { children } = props;

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['menu-home_bg']}>
        <Header title="敏捷分析统一看板" hidden />

        <div className={style2['zy-row']}>
          <Link to="/menu/public" style={{ marginRight: '24px' }}>
            <ApartmentOutlined style={{ marginRight: '8px' }} />
            <span>公共</span>
          </Link>

          <Link to="/menu/team" style={{ marginRight: '24px' }}>
            <UsergroupDeleteOutlined style={{ marginRight: '8px' }} />
            <span>团队</span>
          </Link>

          <Link to="/menu/person">
            <UserOutlined style={{ marginRight: '8px' }} />
            <span>个人</span>
          </Link>
        </div>

        {children}
      </div>
    </ConfigProvider>
  );
};

export default MenuHome;
