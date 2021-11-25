import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Modal, Form, Button, Select, Input } from 'antd';

import style from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const linkTypeList: any = [
  {
    name: '只有领导可以使用',
    value: 1,
  },
  {
    name: '领导和普通用户都可以使用',
    value: 2,
  },
  {
    name: '只有普通用户可以使用',
    value: 3,
  },
];

// 创建链接
const LinkModal: React.FC<any> = (props: any) => {
  const { cref, type = 1 } = props;

  const [form] = Form.useForm();

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
  const submit = () => {};

  return (
    <Modal
      width={700}
      title={type === 1 ? '添加新模块' : '添加新链接'}
      visible={visible}
      onCancel={() => setVisible(false)}
      okText="添加"
      onOk={submit}
      confirmLoading={loading}
    >
      <div style={{ paddingLeft: '140px' }}>
        <Form form={form}>
          {/* 链接名称 */}
          <FormItem
            rules={[{ required: true, message: '请填写链接名称' }]}
            name="title"
            label="链接名称"
            style={{ width: '350px' }}
          >
            <Input placeholder="请填写链接名称" />
          </FormItem>

          {/* 链接路径 */}
          <FormItem
            rules={[{ required: true, message: '请填写链接路径' }]}
            name="link"
            label="链接路径"
            style={{ width: '350px' }}
          >
            <Input placeholder="请填写链接路径" />
          </FormItem>

          {/* 链接路径 */}
          <FormItem
            rules={[{ required: true, message: '请填写排位序列' }]}
            name="link"
            label="排位序列"
            style={{ width: '350px' }}
          >
            <Input placeholder="请填写排位序列,模块显示将以降序排列" />
          </FormItem>

          {/* 二级筛选 */}
          <FormItem
            rules={[{ required: true, message: '请选择使用用户类型' }]}
            name="status"
            label="用户类型"
            style={{ width: '350px' }}
          >
            <Select placeholder="请选择使用用户类型">
              {linkTypeList.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.value} opt={item}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
  );
};

export default LinkModal;
