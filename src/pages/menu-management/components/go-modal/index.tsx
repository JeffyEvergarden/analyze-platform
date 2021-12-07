import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Form, Select, Input, message } from 'antd';
import style from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const extra = {
  autoComplete: 'off',
};

// 创建链接
const GoModal: React.FC<any> = (props: any) => {
  const { cref } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const close = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open(dataNode: any) {
      setVisible(true);
    },
    close,
  }));

  return (
    <Modal
      title="创建看板"
      visible={visible}
      onCancel={() => setVisible(false)}
      cancelText={'取消'}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}></div>
    </Modal>
  );
};

export default GoModal;
