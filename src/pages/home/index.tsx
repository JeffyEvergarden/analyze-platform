import React, { useEffect, useRef } from 'react';
import { history, Link } from 'umi';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { ConfigProvider } from 'antd';
import Header from './components/header';
import Mineview from './components/mine-view';
import Otherview from './components/other-view';
import MenuModal from './components/menu-modal';
import Footer from '@/components/Footer';
import zhCN from 'antd/lib/locale/zh_CN';
import style from './style.less';

// 数据源
import { useMenuModel } from './model';

// 统一门户
const Home: React.FC = (props: any) => {
  const { myList, menuList, setMyList, setMenuList, getMyList, getMenuList, loading1, loading2 } =
    useMenuModel();

  const mineViewRef = useRef<any>(null);

  // 初始化
  useEffect(() => {
    getMyList();
    getMenuList();
  }, []);

  // 我的看板 - 修改结果
  const finish = (val: any) => {
    console.log(val);
    setMyList(val);
  };

  // 打开弹窗

  const menuModalRef = useRef<any>(null);

  const openAdd = () => {
    console.log('打开弹窗');
    (menuModalRef.current as any)?.open(['0_0_0']);
  };

  const addMenu = (arr: any[]) => {
    if (arr && arr.length > 0) {
      mineViewRef.current?.addModule(arr);
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['home-bg']}>
        <Header title="大数据服务门户"></Header>

        <div className={style['home-content']}>
          <Mineview
            cref={mineViewRef}
            list={myList}
            finish={finish}
            loading={loading1}
            openAdd={openAdd}
          />

          <Otherview list={menuList} loading={loading2} />
        </div>

        <Footer />

        <MenuModal cref={menuModalRef} list={menuList} finish={addMenu} />
      </div>
    </ConfigProvider>
  );
};

export default Home;
