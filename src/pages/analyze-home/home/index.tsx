import React from 'react';
import { history, Link } from 'umi';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ConfigProvider, Collapse, Divider } from 'antd';
import { UsergroupDeleteOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import style from './style.less';
const { Panel } = Collapse;

// 留存分析
const HomePage: React.FC = (props: any) => {
  const { children } = props;
  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['zy-column']}>
        <div className={style['title-box']}>
          <Link to="/analyzehome/retained" style={{ marginRight: '16px' }}>
            <UsergroupDeleteOutlined style={{ marginRight: '8px', fontSize: '16px' }} />
            <span style={{ fontSize: '16px' }}>留存分析</span>
          </Link>
          <Link to="/analyzehome/advertising">
            <UsergroupDeleteOutlined style={{ marginRight: '8px', fontSize: '16px' }} />
            <span style={{ fontSize: '16px' }}>广告分析</span>
          </Link>
        </div>

        <div className={style['home-page']}>{children}</div>
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
