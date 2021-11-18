import React, { useEffect, useImperativeHandle } from 'react';
// 通用组件
import { Form, Select, Button, Space, Input } from 'antd';
import { PlusSquareOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import SingleFormItem from '../../../components/common/SingleFormItem';

interface NormalSearchProps {
  cref: any;
  list: [];
  map?: Map<string, any> | undefined;
}

// 通用方法
const trim = (text: any) => {
  if (typeof text === 'string') {
    return text.trim();
  }
  return text;
};

const formateRelation = (text: any) => {
  if (text === 'AND') {
    return '且';
  }
  if (text === 'OR') {
    return '或';
  }
  return '-';
};

const { Item: FormItem } = Form;
const { Option } = Select;

const NormalSearch: React.FC<any> = (props: NormalSearchProps) => {
  const [form] = Form.useForm();
  const { list, cref, map } = props;

  useImperativeHandle(cref, () => {
    return {
      getForm() {
        console.log(form.getFieldValue('childrenList'));
      },
    };
  });

  // 初始化
  useEffect(() => {
    // 数据初始化
    form.setFieldsValue({
      childrenList: [
        {
          attr: undefined,
          op: undefined,
          value: undefined,
          edit: false,
          alias: '',
        },
      ],
    });
  }, []);

  return (
    <Form form={form}>
      <Form.List name="childrenList">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((innerField) => {
                // console.log('innerFields:', innerField);
                return (
                  <SingleFormItem
                    key={innerField.key} // 数组key值
                    field={innerField} // 包含name、 fieldKey
                    form={form}
                    formName={'childrenList'}
                    list={list}
                    map={map}
                  />
                );
              })}
            </div>
          );
        }}
      </Form.List>
    </Form>
  );
};

export default NormalSearch;
