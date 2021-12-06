import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Form, Select, Input, message } from 'antd';
import style from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const extra = {
  autoComplete: 'off',
};

// 创建链接
const DirModal: React.FC<any> = (props: any) => {
  const { cref, confirm, name = '目录', nameKey = 'dirName', loading } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  // const [loading, setLoading] = useState<boolean>(false);

  const [openType, setOpenType] = useState<'new' | 'edit'>('new');

  const [originInfo, setOriginInfo] = useState<any>({});

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let obj: any = {
      _originInfo: originInfo,
      _openType: openType,
      form: {
        ...values,
      },
    };
    // setVisible(false);
    confirm?.(obj);
    return obj;
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      if (!row?.id) {
        setOpenType('new');
        setOriginInfo(row);
        form.resetFields();
      } else {
        setOpenType('edit');
        setOriginInfo(row);
        if (row.form) {
          form.setFieldsValue(row.form);
        } else {
          form.setFieldsValue(row);
        }
      }
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
    submit,
  }));

  return (
    <Modal
      width={700}
      title={(openType === 'new' ? '添加新' : '编辑') + name}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText={openType === 'new' ? '添加' : '确定'}
      onOk={submit}
      confirmLoading={loading}
    >
      <div className={style['modal_bg']} style={{ paddingLeft: '110px' }}>
        <Form form={form} style={{ width: '360px' }}>
          {/* 链接名称 */}
          <FormItem
            rules={[{ required: true, message: `请填写${name}名称` }]}
            name={nameKey}
            label={`${name}名称`}
            style={{ width: '360px' }}
          >
            <Input placeholder="请填写目录名称" {...extra} />
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default DirModal;
