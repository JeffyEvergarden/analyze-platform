import React, { useState, useEffect } from 'react';

import { Form, Space, Select, Input, InputNumber, DatePicker } from 'antd';
import Condition from '../Condition';
import { numberTypeList, arrayTypeList, stringTypeList } from '../../model/const';
import { MinusCircleOutlined } from '@ant-design/icons';
import style from '../style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const InnerForm: React.FC<any> = (props: any) => {
  const { field, form, outIndex, list, map, remove } = props;
  const { key, fieldKey: index } = field;
  const curList: any = form.getFieldValue('childrenList');
  const currentFormValue: any = curList?.[outIndex] || {};
  const currentInnerValue: any = currentFormValue?.innerList[index];

  const type: any = currentInnerValue?.dataType || 'input'; // 类型
  const selectType: any = currentInnerValue?.selectType || 'single'; // 下拉选择类型

  const opList: any[] = currentInnerValue?.operatorList || [];
  const subInnerList: any[] = currentInnerValue?.subList || [];

  // console.log('重新渲染---:' + field.fieldKey);
  // useEffect(() => {}, []);

  // 修改属性
  const changeAttribute = (val: any, options: any, index: number) => {
    // console.log(options);
    // console.log(currentFormValue);
    // console.log(currentInnerValue);
    currentInnerValue.dataType = options.opt.dataType || '';
    let subList: any[] = map?.get(val) || []; // 三级下拉列表
    // console.log(val);
    // console.log(map);
    // console.log(subList);
    let operatorList: any[] = []; // 二级列表
    currentInnerValue.attr = val;
    currentInnerValue.op = undefined;
    currentInnerValue.value = undefined;
    // 二级列表
    if (currentInnerValue.dataType === 'number' || currentInnerValue.dataType === 'dateTime') {
      operatorList = numberTypeList;
    } else if (currentInnerValue.dataType === 'string') {
      operatorList = stringTypeList;
    } else if (currentInnerValue.dataType === 'select') {
      operatorList = arrayTypeList;
    } else if (currentInnerValue.dataType === 'input') {
      operatorList = arrayTypeList;
    }
    currentInnerValue.operatorList = operatorList;
    currentInnerValue.subList = subList;
    // ----------------
    currentFormValue.innerList[index] = currentInnerValue;
    currentFormValue.innerList = [...currentFormValue.innerList];
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  // 修改操作
  const changeOperator = (val: any, options: any, index: number) => {
    // console.log(val);
    console.log(currentInnerValue, 'twotwotwo');

    currentInnerValue.op = val;
    // 多选
    // if (val === 'in' || val === 'not in') {
    if (val === 'contain' || val === 'not contain') {
      currentInnerValue.selectType = 'multi';
      // if (!Array.isArray(currentInnerValue.value)) {
      //   currentInnerValue.value = undefined;
      // }
    } else if (val) {
      currentInnerValue.selectType = 'single';
      // if (Array.isArray(currentInnerValue.value)) {
      //   currentInnerValue.value = undefined;
      // }
    }
    currentInnerValue.value = undefined;

    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  return (
    <div key={key}>
      <div className={style['innerform']}>
        <FormItem
          name={[key, 'attr']}
          fieldKey={[key, 'attr']}
          rules={[{ required: true, message: '请选择属性' }]}
          style={{ marginRight: '8px' }}
        >
          <Select
            style={{ width: '200px' }}
            placeholder="请选择属性"
            onChange={(val: any, options: any) => {
              changeAttribute(val, options, index);
            }}
          >
            {list.map((item: any, i: number) => {
              return (
                <Option key={i} value={item.value} opt={item}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </FormItem>

        <FormItem
          name={[key, 'op']}
          fieldKey={[key, 'op']}
          rules={[{ required: true, message: '请选择比较关系' }]}
          style={{ marginRight: '8px' }}
        >
          <Select
            placeholder="请比较关系"
            style={{ width: '120px' }}
            onChange={(val: any, options: any) => {
              changeOperator(val, options, index);
            }}
          >
            {opList.map((item: any, i: number) => {
              return (
                <Option key={i} value={item.value} opt={item}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </FormItem>

        {/* ---------------- 分界线 ------------- */}
        {/* 多选 */}
        <Condition r-if={type === 'select' && selectType === 'single'}>
          <FormItem
            name={[key, 'value']}
            fieldKey={[key, 'value']}
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select style={{ width: '200px' }} placeholder="请选择">
              {subInnerList.map((item: any, i: number) => {
                return (
                  <Option key={i} value={item.value} opt={item}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Condition>

        {/* 单选 */}
        <Condition r-if={type === 'select' && selectType === 'multi'}>
          <FormItem
            name={[key, 'value']}
            fieldKey={[key, 'value']}
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select style={{ width: '200px' }} placeholder="请选择" mode="multiple">
              {subInnerList.map((item: any, i: number) => {
                return (
                  <Option key={i} value={item.value} opt={item}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Condition>

        {/* 输入框 */}
        <Condition r-if={type === 'input'}>
          <FormItem
            name={[key, 'value']}
            fieldKey={[key, 'value']}
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input style={{ width: '200px' }} placeholder="请输入"></Input>
          </FormItem>
        </Condition>

        {/* 数字框 */}
        <Condition r-if={type === 'number'}>
          <FormItem
            name={[key, 'value']}
            fieldKey={[key, 'value']}
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber style={{ width: '200px' }} placeholder="请输入"></InputNumber>
          </FormItem>
        </Condition>

        {/* 日期 */}
        <Condition r-if={type === 'dateTime'}>
          <FormItem
            name={[key, 'value']}
            fieldKey={[key, 'value']}
            rules={[{ required: true, message: '请选择' }]}
          >
            <DatePicker style={{ width: '200px' }} placeholder="请选择"></DatePicker>
          </FormItem>
        </Condition>

        {/* 删除按钮 */}
        <MinusCircleOutlined
          style={{ marginLeft: '10px', fontSize: '20px', color: '#A0A0A0' }}
          onClick={remove}
        />
      </div>
    </div>
  );
};

export default InnerForm;
