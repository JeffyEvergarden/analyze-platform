import React, { useEffect } from 'react';
import { history, Link } from 'umi';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import Header from './components/header';
import Mineview from './components/mine-view';
import Otherview from './components/other-view';
import Footer from '@/components/Footer';
import zhCN from 'antd/lib/locale/zh_CN';
import style from './style.less';

// 数据源
import { useMenuModel } from './model';

// 统一门户
const Home: React.FC = (props: any) => {
  const { myList, menuList, setMyList, getMyList, getMenuList, loading1, loading2 } =
    useMenuModel();

  useEffect(() => {
    getMyList();
    getMenuList();
  }, []);

  const finish = (val: any) => {
    console.log(val);
    setMyList(val);
  };

  // 打开弹窗
  const openAdd = () => {
    console.log('打开弹窗');
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['home-bg']}>
        <Header title="大数据服务门户"></Header>

        <div className={style['home-content']}>
          <Mineview list={myList} finish={finish} loading={loading1} openAdd={openAdd} />

          <Otherview list={menuList} loading={loading2} />
        </div>

        <Footer />
      </div>
    </ConfigProvider>
  );
};

export default Home;
