import React, { useEffect, useImperativeHandle } from 'react';
// 通用组件
import {
  Form,
  Select,
  Button,
  Space,
  ConfigProvider,
  DatePicker,
  Tooltip,
  InputNumber,
  message,
} from 'antd';
import { PlusSquareOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { timeUnitList } from '../../model/const';
import moment from 'moment';

const { RangePicker } = DatePicker;

interface CompareSearchProps {
  cref: any;
  list: any;
}

const { Item: FormItem } = Form;
const { Option } = Select;

const CompareSearch: React.FC<any> = (props: CompareSearchProps) => {
  const [form] = Form.useForm();
  const { cref, list } = props;

  useImperativeHandle(cref, () => {
    return {
      async getForm() {
        try {
          const fieldsValue: any = await form.validateFields();
          console.log(fieldsValue);
          // let strategy_name = form.getFieldValue('groupBy').find((item: any) => {
          //   return item == 'strategy_name';
          // });
          // console.log(strategy_name);

          // if (fieldsValue) {
          //   if (!strategy_name) {
          //     message.info('分组策略名称必选');
          //     return false;
          //   }
          //   let formData = form.getFieldsValue();
          //   // console.log(formData);

          //   return {
          //     groupFields: formData?.groupBy,
          //     startDate: formData.dateRange && formData?.dateRange[0]?.format('YYYY-MM-DD'),
          //     endDate: formData.dateRange && formData?.dateRange[1]?.format('YYYY-MM-DD'),
          //     timeStep: formData?.step || -1,
          //   };
          // } else {
          //   return false;
          // }
        } catch (e) {}
      },
      async getFormData() {
        const fieldsValue: any = await form.validateFields();
        // console.log(fieldsValue);

        if (fieldsValue) {
          const formData = form.getFieldsValue();
          console.log(formData);

          // if (formData?.dateRange?.length) {
          //   formData.dateRange[0] = formData?.dateRange[0]?.format?.('YYYY-MM-DD');
          //   formData.dateRange[1] = formData?.dateRange[1]?.format?.('YYYY-MM-DD');
          // }

          return { compare: formData };
        } else {
          return false;
        }
      },
      //数据回显
      async setForm(obj: any) {
        if (obj?.dateRange?.length) {
          obj.dateRange[0] = obj.dateRange[0] && moment?.(obj?.dateRange[0]);
          obj.dateRange[1] = obj.dateRange[1] && moment?.(obj?.dateRange[1]);
        }

        form.setFieldsValue(obj);
      },
    };
  });

  // 初始化
  useEffect(() => {
    // 数据初始化
    form.setFieldsValue({
      groupBy: ['strategy_name'],
    });
  }, []);

  return (
    <Form form={form}>
      <FormItem name="groupBy">
        <Select style={{ width: '50%' }} mode="multiple" placeholder="请选择分组">
          {list.map((item: any, index: number) => {
            return (
              <Option key={index} value={item.code}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </FormItem>

      <Space align="baseline" style={{ marginRight: '32px' }}>
        <FormItem name="dateRange" label="选择日期">
          <RangePicker
            format="YYYY-MM-DD"
            style={{ width: '300px' }}
            placeholder={['开始日期', '结束日期']}
            showTime={false}
          ></RangePicker>
        </FormItem>

        <span style={{ marginLeft: '16px' }}>窗口期</span>
        <FormItem name="windowCount">
          <InputNumber placeholder="请输入" style={{ width: '150px' }} min={0} precision={0} />
        </FormItem>
        <FormItem name="windowUnit">
          <Select style={{ width: '150px' }} placeholder="请选择">
            {timeUnitList.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Space>
    </Form>
  );
};

export default CompareSearch;
