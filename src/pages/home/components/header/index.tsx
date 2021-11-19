import React from 'react';
import style from './style.less';

interface HeaderProps {
  title: any;
}

// 统一门户
const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { title } = props;
  return (
    <div className={style['home-header']}>
      <div className={style['header-content']}>
        <div className={style['left']}>{title}</div>
        <div className={style['right']}>部门名称 - 姓名</div>
      </div>
    </div>
  );
};

export default Header;
