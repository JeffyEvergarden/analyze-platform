import React, { useState, useEffect, useRef } from 'react';
import MenuPage from '../index';
// 统一门户-菜单管理

const TeamPage: React.FC<any> = (props: any) => {
  const { children } = props;

  return <MenuPage type="team" />;
};

export default TeamPage;
