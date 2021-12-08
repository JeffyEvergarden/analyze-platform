import React, { useEffect, useImperativeHandle } from 'react';
// 通用组件
import {
  Form,
  Select,
  Button,
  Space,
  Input,
  DatePicker,
  Tooltip,
  InputNumber,
  message,
} from 'antd';
import { PlusSquareOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { groupByList, timeUnitList, timeUnit2List } from '../../model/const';

const { RangePicker } = DatePicker;

interface CompareSearchProps {
  cref: any;
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

const CompareSearch: React.FC<any> = (props: CompareSearchProps) => {
  const [form] = Form.useForm();
  const { cref } = props;

  const setDefaultStep = () => {
    form.setFieldsValue({
      step: undefined,
      unit: undefined,
    });
  };

  useImperativeHandle(cref, () => {
    return {
      async getForm() {
        try {
          const fieldsValue: any = await form.validateFields();
          console.log(fieldsValue);
          let strategy_name = form.getFieldValue('groupBy').find((item: any) => {
            return item == 'strategy_name';
          });
          console.log(strategy_name);

          if (fieldsValue) {
            if (!strategy_name) {
              message.info('分组策略名称必选');
              return false;
            }
            let formData = form.getFieldsValue();
            console.log(formData);

            return {
              groupFields: formData?.groupBy,
              startDate: formData.dateRange && formData?.dateRange[0]?.format('YYYY-MM-DD'),
              endDate: formData.dateRange && formData?.dateRange[1]?.format('YYYY-MM-DD'),
              timeStep: formData?.step || -1,
            };
          } else {
            return false;
          }
        } catch (e) {}
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
      <FormItem name="groupBy" label="分组">
        <Select style={{ width: '40%' }} mode="multiple" placeholder="请选择分组">
          {groupByList.map((item: any, index: number) => {
            return (
              <Option key={index} value={item.value}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </FormItem>

      <Space align="baseline" style={{ marginRight: '32px' }}>
        <FormItem name="dateRange" label="初始事件日期">
          <RangePicker
            style={{ width: '300px' }}
            placeholder={['初始日期的开始', '初始日期的结束']}
            showTime={false}
          ></RangePicker>
        </FormItem>

        <span style={{ marginLeft: '16px' }}>按</span>
        <FormItem name="timeUnit">
          <Select style={{ width: '120px' }} placeholder="统计单位">
            {timeUnitList.map((item: any, index: number) => {
              return (
                <Option key={index} value={item.value}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </FormItem>
        <span>统计</span>
      </Space>

      <Space align="baseline">
        <FormItem name="step" label="观测步长">
          <InputNumber style={{ width: '120px' }} placeholder="请输入步长"></InputNumber>
        </FormItem>
        <FormItem name="unit">
          <Select style={{ width: '120px' }} placeholder="统计单位">
            {timeUnit2List.map((item: any, index: number) => {
              return (
                <Option key={index} value={item.value}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </FormItem>
        <span>OR</span>
        <Tooltip title={'默认步长为 当天、3天、7天、15天、30天'}>
          <Button onClick={setDefaultStep}>恢复默认步长</Button>
        </Tooltip>
      </Space>
    </Form>
  );
};

export default CompareSearch;
