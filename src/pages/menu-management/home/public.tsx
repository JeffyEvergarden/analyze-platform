import React, { useState, useEffect, useRef } from 'react';
import MenuPage from '../index';

// 统一门户-菜单管理

const PublicPage: React.FC<any> = (props: any) => {
  const { children } = props;

  return <MenuPage type="public" />;
};

export default PublicPage;
