import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Button, Input, message, Modal } from 'antd';

const MenuModal: React.FC = ({ cref }: any) => {
  const [visible, setVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  useImperativeHandle(cref, () => ({
    open: () => {
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const submit = () => {
    console.log('提交');
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
      <div></div>
    </Modal>
  );
};

export default MenuModal;
