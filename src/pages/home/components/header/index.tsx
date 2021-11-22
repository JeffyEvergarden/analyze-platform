import React from 'react';
import style from './style.less';
import { useModel } from 'umi';
import Condition from '../Condition';

interface HeaderProps {
  title: any;
}

// 头部标签
const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { title } = props;
  const { initialState, setInitialState } = useModel('@@initialState');

  const { isLogin = false, currentUser } = initialState || {};

  return (
    <div className={style['home-header']}>
      <div className={style['header-content']}>
        <div className={style['left']}>{title}</div>
        <div className={style['right']}>
          <Condition r-if={!isLogin}>
            <div className={style['login-text']}>登录</div>
          </Condition>
          <Condition r-if={isLogin}>
            <div>部门名称 - {(currentUser as any)?.userName}</div>
          </Condition>
        </div>
      </div>
    </div>
  );
};

export default Header;
