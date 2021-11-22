import React, { useState, useEffect } from 'react';
import Header from '../home/components/header';
import style from './style.less';

// 统一门户-菜单管理

const MenuManagement: React.FC<any> = (props: any) => {
  return (
    <div className={style['menu-home_bg']}>
      <Header title="菜单管理" />
    </div>
  );
};

export default MenuManagement;
