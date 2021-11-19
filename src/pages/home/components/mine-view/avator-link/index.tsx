import React from 'react';
import Condition from '../../Condition';
import style from '../../style.less';

interface AvatorLinkProps {
  icon: any;
  title: any;
  link: any;
}

// 统一门户
const Header: React.FC<AvatorLinkProps> = (props: AvatorLinkProps) => {
  const { title, icon, link } = props;

  const firstWord = (title || '')[0];

  const onLink = () => {
    window.open(link);
  };
  return (
    <div className={style['avator-bg']} onClick={onLink}>
      <Condition r-if={icon}>
        {/* 有图片或者图标 */}
        <img src={icon} alt="icon" className={style['avator-img']} />
      </Condition>
      <Condition r-if={!icon && title}>
        <div className={style['avator-img']}>{firstWord}</div>
      </Condition>
      <div className={style['avator-label']}>{title}</div>
    </div>
  );
};

export default Header;
