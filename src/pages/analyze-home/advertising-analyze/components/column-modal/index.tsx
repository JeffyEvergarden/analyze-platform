import React, { useState, useImperativeHandle } from 'react';
import { Form, Select, message, Modal, Input, Space, Button } from 'antd';
// import { useLibraryModel } from './modal';
import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Item: FormItem, List: FormList } = Form;

interface BaseFormProps {
  confirm?: (store: any) => void;
  cref?: any;
  list: any[];
}

const CONDITION_LIST: any[] = [
  {
    value: '+',
    label: '+',
  },
  {
    value: '-',
    label: '-',
  },
  {
    value: 'x',
    label: 'x',
  },
  {
    value: '÷',
    label: '÷',
  },
];

const ColumnModal: React.FC<BaseFormProps> = (props) => {
  const { confirm, cref, list } = props;
  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  // const [libraryList, getLibraryList] = useLibraryModel();

  const save = async () => {
    form
      .validateFields()
      .then((res: any) => {
        confirm?.(res);
        setVisible(false);
      })
      .catch((err: any) => {
        message.warning('请填写完整');
      });
  };

  const close = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open() {
      form.resetFields();
      console.log(list);
      setVisible(true);
    },
    close() {},
  }));

  return (
    <Modal
      title="添加自定义指标列"
      visible={visible}
      width={950}
      onOk={save}
      okText={'确定'}
      onCancel={close}
      cancelText={'取消'}
    >
      <div>
        <Form form={form}>
          <FormList name="list">
            {(fields: any, { add: _add, remove: _remove }) => {
              const addOutNew = () => {
                // console.log(fields);
                let length = fields.length;
                _add(
                  {
                    compare1: undefined,
                    condition: undefined,
                    compare2: undefined,
                    alias: '',
                  },
                  length,
                );
              };

              return (
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <Button
                      type="link"
                      icon={<AppstoreAddOutlined />}
                      style={{ marginLeft: '10px' }}
                      onClick={addOutNew}
                    >
                      新增自定义指标
                    </Button>
                  </div>
                  <div>
                    {fields.map((field: any, index: number) => {
                      return (
                        <Space align="start" key={field.key}>
                          <div>
                            <Button
                              icon={<MinusCircleOutlined />}
                              type="link"
                              danger
                              onClick={() => {
                                _remove(index);
                              }}
                            />
                          </div>
                          <FormItem
                            name={[field.name, 'compare1']}
                            rules={[{ required: true, message: '请选择比较指标' }]}
                            style={{ width: '200px' }}
                          >
                            <Select placeholder="请选择比较指标">
                              {list.map((item: any) => {
                                return (
                                  <Select.Option value={item.value} key={item.value} item={item}>
                                    {item.label}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </FormItem>

                          <FormItem
                            name={[field.name, 'condition']}
                            rules={[{ required: true, message: '运算方式' }]}
                          >
                            <Select placeholder="请选择比较方式" style={{ width: '110px' }}>
                              {CONDITION_LIST.map((item: any) => {
                                return (
                                  <Select.Option value={item.value} key={item.value} item={item}>
                                    {item.label}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </FormItem>

                          <FormItem
                            name={[field.name, 'compare2']}
                            rules={[{ required: true, message: '请选择比较指标' }]}
                          >
                            <Select placeholder="请选择比较指标" style={{ width: '200px' }}>
                              {list.map((item: any) => {
                                return (
                                  <Select.Option value={item.value} key={item.value} item={item}>
                                    {item.label}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </FormItem>

                          <FormItem
                            name={[field.name, 'alias']}
                            rules={[{ required: true, message: '请输入当前指标别名' }]}
                          >
                            <Input
                              placeholder="请输入别名"
                              style={{ width: '180px', marginLeft: '20px' }}
                              maxLength={20}
                            ></Input>
                          </FormItem>
                        </Space>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          </FormList>
        </Form>
      </div>
    </Modal>
  );
};

export default ColumnModal;
