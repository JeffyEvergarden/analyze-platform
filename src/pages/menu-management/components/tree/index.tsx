import React, { useState, useEffect } from 'react';
import { Tree, Modal } from 'antd';

interface TreeProps {
  data: any[];
}

const { DirectoryTree } = Tree;

const { confirm } = Modal;

const MyTree: React.FC<TreeProps> = (props: TreeProps) => {
  const { data } = props;

  return <DirectoryTree treeData={data} />;
};

export default MyTree;
