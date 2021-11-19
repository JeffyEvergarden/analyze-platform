import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import Condition from '../../Condition';
import style from '../../style.less';

interface AvatorLinkProps {
  icon: any;
  title: any;
  link: any;
  onDelete: (...args: any[]) => void;
}

// 统一门户
const Avator: React.FC<AvatorLinkProps> = (props: AvatorLinkProps) => {
  const { title, icon, link, onDelete } = props;

  const firstWord = (title || '')[0];

  return (
    <div className={style['avator-bg_edit']}>
      <div
        className={style['delete-icon']}
        onClick={() => {
          onDelete?.();
        }}
      >
        <CloseCircleOutlined />
      </div>
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

export default Avator;
