import React, { useState, useEffect } from 'react';
import { history, Link, useLocation } from 'umi';
import {
  BookOutlined,
  LinkOutlined,
  StockOutlined,
  FundViewOutlined,
  DesktopOutlined,
  WindowsOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import { ConfigProvider, Collapse, Divider, Menu, Button } from 'antd';
import { UsergroupDeleteOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import style from './style.less';
const { Panel } = Collapse;

// 留存分析
const HomePage: React.FC = (props: any) => {
  const { children } = props;

  const location = useLocation();

  const [current, setCurrent] = useState<any>('/analyzehome/bgsevent');

  useEffect(() => {
    if (location.pathname === '/analyzehome') {
      setCurrent('/analyzehome/bgsevent');
    } else {
      setCurrent(location.pathname);
    }
  }, []);

  const onItemClick = (obj: any) => {
    // console.log(obj);
    window.open(`/bd/createModule?type=${obj.key}`);
  };

  const goToLink = (obj: any) => {
    // console.log(obj);
    let keypath = obj.keyPath || [];
    if (keypath.length > 1) {
      onItemClick(obj);
    } else {
      setCurrent(obj.key);
      history.replace(obj.key);
    }
  };

  const extraButton = (
    <Menu.SubMenu key="sub-item" title="其他...">
      <Menu.Item key="activity">子活动转化分析</Menu.Item>
      <Menu.Item key="ynf">活动分析</Menu.Item>
      <Menu.Item key="sub-activity">广告分析</Menu.Item>
    </Menu.SubMenu>
  );
  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['zy-column']}>
        <div className={style['link']}>
          <div style={{ flex: 1 }}>
            <Menu onClick={goToLink} selectedKeys={[current]} mode="horizontal">
              <Menu.Item key="/analyzehome/retained" icon={<UsergroupDeleteOutlined />}>
                留存分析
              </Menu.Item>
              <Menu.Item key="/analyzehome/bgsevent" icon={<WindowsOutlined />}>
                BGS策略分析
              </Menu.Item>
              <Menu.Item key="/analyzehome/advertise" icon={<FundViewOutlined />}>
                广告分析
              </Menu.Item>
              <Menu.Item key="/analyzehome/price" icon={<StockOutlined />}>
                提额&调价分析
              </Menu.Item>
              <Menu.Item key="/analyzehome/operationIndex" icon={<DesktopOutlined />}>
                常规运营指标分析
              </Menu.Item>
              {extraButton}
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
