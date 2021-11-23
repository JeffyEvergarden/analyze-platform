import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, Checkbox, Modal } from 'antd';
import Condition from '../Condition';
import style from './style.less';

const CheckboxGroup = Checkbox.Group;

const MenuModal: React.FC<any> = (props: any) => {
  const { cref, list = [], finish } = props;

  const [visible, setVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [originKey, setOriginKey] = useState<any[]>([]);
  const [selectKey, setSelectKey] = useState<any[]>([]);

  const onChange = (list: any[]) => {
    setSelectKey(list);
  };

  useImperativeHandle(cref, () => ({
    open: (arr?: any[]) => {
      if (arr && Array.isArray(arr)) {
        setOriginKey([...arr]);
        setSelectKey([...arr]);
      } else {
        setOriginKey([]);
        setSelectKey([]);
      }
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    console.log('提交', selectKey);
    let arr: any[] = [];
    let len = originKey.length - 1;
    selectKey.forEach((keyStr: string, index: number) => {
      if (index <= len) {
        console.log('过滤重复的key值');
        return;
      }
      let keys = keyStr.split('_').map((item: any) => Number(item));
      // console.log(keys);
      if (keys.length < 3) {
        return;
      }
      arr.push(list[keys[0]].list[keys[1]].list[keys[2]]);
    });
    console.log(arr);
    finish?.(arr);
    setVisible(false);
  };

  return (
    <Modal
      width={1000}
      title="添加应用"
      visible={visible}
      onCancel={() => setVisible(false)}
      okText="添加"
      onOk={submit}
      confirmLoading={loading}
    >
      <div className={style['menu-home_bg']}>
        <CheckboxGroup value={selectKey} onChange={onChange}>
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
                        <div key={`sub_${subIndex}_${thirdIndex}`}>
                          <Checkbox
                            value={`${index}_${subIndex}_${thirdIndex}`}
                            disabled={originKey.indexOf(`${index}_${subIndex}_${thirdIndex}`) > -1}
                          >
                            <div className={style['desc_block']}>{thirdItem?.title}</div>
                          </Checkbox>
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
        </CheckboxGroup>
      </div>
    </Modal>
  );
};

export default MenuModal;
