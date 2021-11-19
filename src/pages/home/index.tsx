import React from 'react';
import { history, Link } from 'umi';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import Header from './components/header';
import Mineview from './components/mine-view';
import zhCN from 'antd/lib/locale/zh_CN';
import style from './style.less';

// 数据源
import { useMenuModel } from './model';
import { useEffect } from 'react';

// 统一门户
const Home: React.FC = (props: any) => {
  const { myList, menuList, getMyList, getMenuList, loading1 } = useMenuModel();

  useEffect(() => {
    getMyList();
    getMenuList();
  }, []);

  const finish = (val: any) => {
    console.log(val);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['home-bg']}>
        <Header title="大数据服务门户"></Header>

        <div className={style['home-content']}>
          <Mineview list={myList} finish={finish} loading={loading1} />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Home;
