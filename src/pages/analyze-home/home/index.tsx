import React from 'react';
import { history, Link, useLocation } from 'umi';
import { BookOutlined, LinkOutlined, StockOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ConfigProvider, Collapse, Divider, Menu, Button } from 'antd';
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

  const [current, setCurrent] = useState<any>('/analyzehome/retained');

  useEffect(() => {
    setCurrent(location.pathname);
  }, []);

  const goToLink = (obj: any) => {
    // console.log(obj);
    setCurrent(obj.key);
    history.replace(obj.key);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['zy-column']}>
        <div className={style['link']}>
          <div style={{ flex: 1 }}>
            <Menu onClick={goToLink} selectedKeys={[current]} mode="horizontal">
              <Menu.Item key="/analyzehome/retained" icon={<UsergroupDeleteOutlined />}>
                留存分析
              </Menu.Item>
              <Menu.Item key="/analyzehome/advertise" icon={<UsergroupDeleteOutlined />}>
                广告分析
              </Menu.Item>
              <Menu.Item key="/analyzehome/price" icon={<StockOutlined />}>
                提额&调价分析
              </Menu.Item>
              <Menu.Item key="/analyzehome/operationIndex" icon={<StockOutlined />}>
                运营指标分析
              </Menu.Item>
            </Menu>
          </div>

          <div style={{ width: '100px', marginRight: '40px' }}>
            <Button
              onClick={() => {
                window.open(window.location.protocol + '//' + window.location.host + '/bd/');
              }}
            >
              前往分析看板
            </Button>
          </div>
        </div>

        <div className={style['home-page']}>{children}</div>
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
