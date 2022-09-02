import React, { useState, useEffect, useImperativeHandle, useMemo } from 'react';
// 通用组件
import { Form, Select, Space, DatePicker, InputNumber } from 'antd';
import { timeUnitList } from '../../model/const';
import moment from 'moment';
import { TitleList } from '../../model/const';
import Condition from '../common/Condition';

const { RangePicker } = DatePicker;

const map: any = {
  day_id: '事件发生日期',
  batch_date: '批次日期',
};

interface CompareSearchProps {
  cref: any;
  list: any;
  setFilter: any;
  defaultGroupBy?: any[];
  compareTimeFlag?: boolean; //是否开启 事件日期、窗口期选择
}

const { Item: FormItem } = Form;
const { Option } = Select;

const CompareSearch: React.FC<any> = (props: CompareSearchProps) => {
  const [form] = Form.useForm();
  const { cref, list, setFilter, defaultGroupBy, compareTimeFlag = true } = props;

  const [selectDateType, setSelectDateVal] = useState<any>('');

  useImperativeHandle(cref, () => {
    return {
      async getForm() {
        try {
          const fieldsValue: any = await form.validateFields();
          // console.log(fieldsValue);
          if (fieldsValue) {
            return fieldsValue;
          } else {
            return false;
          }
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
        form.setFieldsValue(obj);
      },
    };
  });

  const onchangeDateVal = (text: any, item: any) => {
    setSelectDateVal(text);
    let groupVal = form.getFieldValue('groupBy');
    let keys = Object.keys(map);
    groupVal = groupVal.filter((item: any) => {
      return !keys.includes(item);
    });
    if (groupVal) {
      groupVal.push(text);
    }
    form.setFieldsValue({
      groupBy: groupVal,
    });
  };

  const computedList = useMemo(() => {
    let arr = [...list];
    // let len = TitleList.length;
    // let i = len - 1;
    // 取完并集  和  TitleList 再取并集
    // while (i > -1) {
    //   if (
    //     !list.some((item: any) => {
    //       return item.value === TitleList[i].key;
    //     })
    //   ) {
    //     arr.unshift({
    //       value: TitleList[i].key,
    //       name: TitleList[i].label,
    //     });
    //   }
    //   i--;
    // }
    // 过滤掉不显示的字段
    // arr = arr.filter((item: any) => {
    //   return !['event_occur_time'].includes(item.value);
    // });
    return arr;
  }, [list]);

  useEffect(() => {
    if (computedList.length > 0) {
      let groupVal = form.getFieldValue('groupBy') || [];
      let keys = computedList.map((item: any) => {
        return item.value;
      });
      groupVal = groupVal.filter((item: any) => {
        return keys.includes(item);
      });
      form.setFieldsValue({
        groupBy: [...groupVal],
      });
    }
  }, [computedList]);

  // 初始化
  useEffect(() => {
    // 数据初始化

    const _defaultGroupBy = Array.isArray(defaultGroupBy) ? defaultGroupBy : [];

    form.setFieldsValue({
      groupBy: _defaultGroupBy,
    });
  }, []);

  useEffect(() => {
    setFilter?.(computedList);
  }, [computedList]);

  return (
    <Form form={form}>
      <FormItem name="groupBy">
        <Select style={{ width: '50%' }} mode="multiple" placeholder="请选择分组">
          {computedList.map((item: any, index: number) => {
            return (
              <Option key={index} value={item.value}>
                {item.name}
              </Option>
            );
          })}
        </Select>
      </FormItem>

      <Condition r-if={compareTimeFlag}>
        <Space align="baseline" style={{ marginRight: '32px' }}>
          <span>事件发生日期</span>

          <FormItem name="daterange">
            <RangePicker
            // format="YYYY-MM-DD"
            // style={{ width: '300px' }}
            // placeholder={['开始日期', '结束日期']}
            // showTime={false}
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
      </Condition>
    </Form>
  );
};

export default CompareSearch;
