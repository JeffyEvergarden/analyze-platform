import React from 'react';
import { history, Link } from 'umi';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ConfigProvider, Collapse, Divider } from 'antd';
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
          <Link to="/analyzehome/retained">
            <LinkOutlined />
            <span>留存分析</span>
          </Link>
        </div>

        <div className={style['home-page']}>{children}</div>
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
