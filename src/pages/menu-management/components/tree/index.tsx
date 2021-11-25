import React, { useState, useEffect } from 'react';
import { Tree, Modal, Button } from 'antd';
import { useLocation } from 'react-router';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Condition from '../../../home/components/Condition';
import style from './style.less';

interface TreeProps {
  data: any[];
  onChange?: (...args: any) => void;
}

const { DirectoryTree } = Tree;
// tree 组件属性解释
// blockNode 是否节点占据一行

const { confirm } = Modal;

// 获取父节点
const getParentNode = (obj: any, arr: any) => {
  let newArr: any = [...arr];
  newArr.shift();
  newArr.pop();
  console.log(newArr);
  let tmp = obj;
  newArr.forEach((it: any) => {
    tmp = tmp[it];
  });
  if (tmp !== obj) {
    return tmp;
  } else {
    return null;
  }
};

const MyTree: React.FC<TreeProps> = (props: TreeProps) => {
  const { data, onChange } = props;

  const [dataSource, setDataSource] = useState<any[]>([]);

  const location: any = useLocation();

  const query: any = location?.query;

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  // 选择节点
  const onSelect = (val: any, opt: any) => {
    console.log(val, opt);
    onChange?.(val, opt);
  };
  // ----
  // 复制节点
  const copyNode = (node: any) => {
    let newNode = {
      key: node.key,
      title: node.title,
      children: node.children,
      isLeaf: true,
    };
    return newNode;
  };

  // ---------- 最重要的方法
  const onDrop = (info: any) => {
    console.log(info);
    // info.dragNode - 拖动节点
    // info.node 目标节点
    // dropPosition    1-插到子节点  3-插到目标节点后面
    // 获取拖动节点位置
    let dragPos: any[] = info.dragNode.pos.split('-'); // 拖动节点
    // 获取目标节点位置
    let nodePos: any = info.node.pos.split('-'); // 目标节点
    // dropToGap = true ===> 表示可以直接在同级
    let dropToGap: any = info.dropToGap;
    let dropPosition: any = info.dropPosition;

    info.node.children = info.node.children || [];
    // 如果 拖拽节点层级 < 目标节点层级
    if (dragPos.length < nodePos.length) {
      // 同层的节点变成目标节点的子节点
      return false;
    }
    // 这种情况在目标节点首插入
    if (!dropToGap) {
      //dragPos
      if (dragPos.length === nodePos.length) {
        // 同层的节点变成目标节点的子节点
        return false;
      }
      // 跨级变动
      // 取父节点
      let parentDragNode = getParentNode(dataSource, dragPos);
      console.log(parentDragNode?.title);
      // 删除节点
      console.log(dragPos[dragPos.length - 1]);
      parentDragNode?.children?.splice(dragPos[dragPos.length - 1], 1);
      // 插入节点
      info.node.children.unshift(copyNode(info.dragNode));
    }
    if (dropToGap) {
      //dragPos
      if (dragPos.length === nodePos.length && info.dragNode.isLeaf) {
        // 表示同层的节点
        console.log('同层的节点');
        console.log(dropPosition);
        // 找父节点
        let parentDragNode = getParentNode(dataSource, dragPos);
        // 删除该节点
        parentDragNode?.children?.splice(dragPos[dragPos.length - 1], 1);
        let parentTargetNode = getParentNode(dataSource, nodePos);
        let children = (parentTargetNode.children = parentTargetNode.children || []);
        // console.log('children:', JSON.parse(JSON.stringify(children)));
        let index = children.findIndex((item: any) => {
          return item.key === info.node.key;
        });
        console.log(index);
        children.splice(index + 1, 0, copyNode(info.dragNode));
      }
    }
    // 更新节点
    setDataSource([...dataSource]);
  };

  // 打开编辑弹窗
  const openEditModal = (e: any, nodeData: any) => {
    // 阻止冒泡
    e.stopPropagation();
    console.log('打开编辑事件');
  };

  // 删除菜单
  const deleteMenu = (e: any, nodeData: any) => {
    // 阻止冒泡
    e.stopPropagation();
    console.log('删除事件');
  };

  // 自定义渲染
  const diyRender = (nodeData: any) => {
    return (
      <div className={style['tree-node']}>
        <div className={style['label']}>{nodeData.title}</div>
        <div className={style['edit-layout']}>
          <EditOutlined
            style={{ marginRight: '8px' }}
            onClick={(e) => {
              openEditModal(e, nodeData);
            }}
          />
          <DeleteOutlined
            onClick={(e) => {
              deleteMenu(e, nodeData);
            }}
          />
        </div>
      </div>
    );
  };

  // ----
  const onClick = () => {
    console.log(dataSource);
  };

  return (
    <div>
      <Condition r-if={query?.test}>
        <div className={style['test-box']}>
          <Button type="primary" onClick={onClick}>
            输出树形结构
          </Button>
        </div>
      </Condition>

      <DirectoryTree
        treeData={dataSource}
        onSelect={onSelect}
        titleRender={diyRender}
        blockNode
        draggable
        onDrop={onDrop}
      />
    </div>
  );
};

export default MyTree;
