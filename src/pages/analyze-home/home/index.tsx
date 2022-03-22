import React from 'react';
import { history, Link, useLocation } from 'umi';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ConfigProvider, Collapse, Divider, Menu } from 'antd';
import { UsergroupDeleteOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import style from './style.less';
import { useState } from 'react';
import { useEffect } from 'react';
const { Panel } = Collapse;

// 留存分析
const HomePage: React.FC = (props: any) => {
  const { children } = props;

  const location = useLocation();

  const [current, setCurrent] = useState<any>();

  useEffect(() => {
    setCurrent(location.pathname);
  }, []);

  const goToLink = (obj: any) => {
    console.log(obj);
    setCurrent(obj.key);
    history.replace(obj.key);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['zy-column']}>
        <div>
          <Menu onClick={goToLink} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="/analyzehome/retained" icon={<UsergroupDeleteOutlined />}>
              留存分析
            </Menu.Item>
            <Menu.Item key="/analyzehome/advertise" icon={<UsergroupDeleteOutlined />}>
              广告分析
            </Menu.Item>
          </Menu>
        </div>

        <div className={style['home-page']}>{children}</div>
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
