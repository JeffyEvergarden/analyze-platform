import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import AvatorLink from '../avator-edit-link';
import style from '../../style.less';
import { ReactSortable } from 'react-sortablejs';
import { PlusSquareOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

// 统一门户
const EditPanel: React.FC<any> = (props: any) => {
  const { cref, list } = props;
  const [editList, setEditList] = useState<any[]>([]);
  const editRef = useRef<any>(null);

  // 根据
  useEffect(() => {
    let newlist = [...list, { id: 'last', filtered: true }];
    // editRef.current = newlist;
    setEditList(newlist);
  }, [list]);

  const onDelete = (i: number) => {
    editList.splice(i, 1);
    let newlist = [...editList];
    // editRef.current = newlist;
    setEditList(newlist);
  };

  const fake = useRef<any>(null);

  useImperativeHandle(cref, () => ({
    getValue: () => {
      return editList;
    },
  }));

  const onMove = (evt: any) => {
    console.log(evt);
    let newIndex = evt.newIndex;
    let dom = evt.related;
    if (dom.id === 'last') {
      console.log('移动到最后一个节点');
      return false;
    }
    return true;
  };

  return (
    <div ref={fake}>
      <ReactSortable
        className={style['module-content']}
        filter="#last"
        list={editList}
        setList={setEditList}
        onMove={onMove}
      >
        {editList.map((item: any, index: any) => {
          let flag = index % 6 === 5;
          if (item.id === 'last') {
            return (
              <div key={item.id} id="last" className={style['avator-bg_edit']}>
                <div className={style['avator-icon_add']}>
                  <PlusSquareOutlined style={{ color: '#1890FF', fontSize: '30px' }} />
                </div>
                <div className={style['avator-label']}>添加应用</div>
              </div>
            );
          }
          return (
            <div key={index} data-id={index}>
              <AvatorLink
                index={index}
                icon={item?.icon}
                link={item.link}
                title={item.title}
                onDelete={() => {
                  onDelete(index);
                }}
              />
            </div>
          );
        })}
      </ReactSortable>
    </div>
  );
};

export default EditPanel;
