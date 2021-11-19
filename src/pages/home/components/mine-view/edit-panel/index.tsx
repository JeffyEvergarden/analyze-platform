import React, { useEffect, useState } from 'react';
import AvatorLink from '../avator-edit-link';
import style from '../../style.less';

// 统一门户
const EditPanel: React.FC<any> = (props: any) => {
  const { cref, list } = props;
  const [editList, setEditList] = useState<any[]>([]);
  // 根据
  useEffect(() => {
    setEditList([...list]);
  }, [list]);

  const onDelete = (i: number) => {
    editList.splice(i, 1);
    setEditList([...editList]);
  };

  return (
    <div className={style['module-content']}>
      {editList.map((item: any, index: any) => {
        let flag = index % 6 === 5;
        return (
          <div style={{ marginRight: flag ? '' : '56px' }}>
            <AvatorLink
              key={index}
              icon={item.icon}
              link={item.link}
              title={item.title}
              onDelete={() => {
                onDelete(index);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default EditPanel;
