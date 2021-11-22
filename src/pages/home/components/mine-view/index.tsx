import React, { useEffect, useState } from 'react';
import EditPanel from './edit-panel';
import AvatorLink from './avator-link';
import { Spin } from 'antd';
import style from '../style.less';
import Condition from '../Condition';
import { useRef } from 'react';

// 统一门户
const MineView: React.FC<any> = (props: any) => {
  const { list, finish, loading, openAdd } = props;

  const editPanelRef = useRef<any>({});
  // 编辑状态
  const [edit, setEdit] = useState<boolean>(false);

  const finished = () => {
    setEdit(false);
    let arr = editPanelRef?.current.getValue() || [];
    arr = arr.filter((item: any) => {
      return item.id !== 'last';
    });
    finish(arr);
  };

  const openEditType = () => {
    setEdit(true);
  };

  return (
    <Spin spinning={loading}>
      <div className={style['module-mine_bg']}>
        <div className={style['module-title']}>
          <div className={style['left']}>我的看板</div>
          <Condition r-if={!edit}>
            <div className={style['right']} onClick={openEditType}>
              自定义看板
            </div>
          </Condition>
          <Condition r-if={edit}>
            <div className={style['right']} onClick={finished}>
              完成
            </div>
          </Condition>
        </div>

        {/* 列表状态 */}
        <Condition r-if={!edit}>
          <div className={style['module-content']}>
            {list.map((item: any, index: any) => {
              let flag = index % 6 === 5;
              return (
                <div key={index}>
                  <AvatorLink icon={item.icon} link={item.link} title={item.title} />
                </div>
              );
            })}
          </div>
        </Condition>

        {/* 编辑状态 */}
        <Condition r-if={edit}>
          <EditPanel list={list} cref={editPanelRef} openAdd={openAdd}></EditPanel>
        </Condition>
      </div>
    </Spin>
  );
};

export default MineView;
