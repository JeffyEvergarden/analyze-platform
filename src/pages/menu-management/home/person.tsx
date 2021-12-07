import React, { useState, useEffect, useRef } from 'react';
import MenuPage from '../index';
// 统一门户-菜单管理

const PersonPage: React.FC<any> = (props: any) => {
  const { children } = props;

  return <MenuPage type="person" />;
};

export default PersonPage;
