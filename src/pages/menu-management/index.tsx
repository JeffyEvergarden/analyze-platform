import React, { useState, useEffect } from 'react';
import Header from '../home/components/header';
import style from './style.less';
import { useMenuModel } from './model';
import MyTree from './components/tree';
// 统一门户-菜单管理

const MenuManagement: React.FC<any> = (props: any) => {
  // 菜单列表
  const { menuList } = useMenuModel();

  return (
    <div className={style['menu-home_bg']}>
      <Header title="大数据服务门户" />

      <div className={style['menu-box']}>
        <div className={style['menu-left']}>
          <MyTree data={menuList} />
        </div>

        <div className={style['menu-right']}></div>
      </div>
    </div>
  );
};

export default MenuManagement;
