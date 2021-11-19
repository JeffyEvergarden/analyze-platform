import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import style from '../style.less';
import Condition from '../Condition';

// 跳转视图

const OtherView: React.FC<any> = (props: any) => {
  const { list = [], loading } = props;

  return (
    <Spin spinning={loading}>
      <div className={style['module_bg']}>
        <div className={style['module-title']}>
          <div className={style['left']}>数据服务</div>
        </div>

        {/* 列表状态 */}
        {list.map((item: any, index: number) => {
          const { title, icon, list = [] } = item;

          return (
            <div key={index} className={style['module-content']}>
              <div className={style['title-bg']}>
                <div className={style['img-icon_bg']}>
                  <img src={icon} className={style['img-icon']} />
                </div>
                <div> {title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Spin>
  );
};

export default OtherView;
