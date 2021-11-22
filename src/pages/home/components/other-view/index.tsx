import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import style from '../style.less';
import Condition from '../Condition';

// 跳转视图

const OtherView: React.FC<any> = (props: any) => {
  const { list = [], loading } = props;

  const onLink = (link: any) => {
    if (!link) {
      message.warning('链接失效');
      return;
    }
    if (link.indexOf('http') < 0) {
      link = 'https://' + link;
    }
    window.open(link);
  };

  return (
    <Spin spinning={loading}>
      <div className={style['module_bg']}>
        <div className={style['module-title']}>
          <div className={style['left']}>数据服务</div>
        </div>

        {/* 列表状态 */}
        {list.map((item: any, index: number) => {
          const { title, icon, list = [] } = item;
          //二级、三级列表
          const subList: any[] = list.map((subItem: any, subIndex: any) => {
            const { title: subTitle, list: secList = [] } = subItem;

            return (
              <div key={`sub_${subIndex}`} className={style['box-content']}>
                <div className={style['title']}>{subTitle}</div>

                <div className={style['desc']}>
                  {secList.map((thirdItem: any, thirdIndex: any) => {
                    return (
                      <div
                        key={`sub_${subIndex}_${thirdIndex}`}
                        className={style['desc_block']}
                        onClick={() => {
                          onLink(thirdItem?.link);
                        }}
                      >
                        {thirdItem?.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });

          // 一级循环
          return (
            <div key={index} className={style['module-content']}>
              <div className={style['title-bg']}>
                <Condition r-if={icon}>
                  <div className={style['img-icon_bg']}>
                    <img src={icon} className={style['img-icon']} />
                  </div>
                </Condition>
                <div> {title}</div>
              </div>
              {subList}
            </div>
          );
        })}
      </div>
    </Spin>
  );
};

export default OtherView;
