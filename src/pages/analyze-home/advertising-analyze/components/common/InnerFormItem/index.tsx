import React, { useState, useEffect } from 'react';

import { Form, Space, Select, Input, InputNumber, DatePicker } from 'antd';
import Condition from '../Condition';
import { numberTypeList, arrayTypeList, stringTypeList } from '../../../model/const';
import { MinusCircleOutlined } from '@ant-design/icons';
import style from '../style.less';

const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const InnerForm: React.FC<any> = (props: any) => {
  const { field, form, outIndex, remove, fieldMap, fieldsList } = props;
  const { key, fieldKey: index } = field;

  const curList: any = form.getFieldValue('childrenList');
  const currentFormValue: any = curList?.[outIndex] || {};
  const currentInnerValue: any = currentFormValue?.innerList[index];

  const _currentSubject: any = currentInnerValue?.subject;

  const _currentSubjectItem = fieldsList?.find?.((item: any) => {
    return item.value === _currentSubject;
  });

  // console.log('_currentSubjectItem');
  // console.log(_currentSubject, _currentSubjectItem, fieldsList);

  const type: any = _currentSubjectItem?.dataType || 'input'; // 类型

  const subInnerList: any[] = _currentSubjectItem?.list || [];

  const currentOp: any = currentInnerValue?.operator;

  // 修改属性
  const changeAttribute = (val: any, type?: any) => {
    let formValues = form.getFieldValue('childrenList');
    let _formValue = formValues[outIndex]?.innerList || [];
    _formValue[index].subject = val;
    _formValue[index].operator = undefined;
    _formValue[index].params = undefined;
    formValues[outIndex].innerList = [..._formValue];
    form.setFieldsValue({
      childrenList: [...formValues],
    });
  };

  // 修改操作
  const changeOperator = (outIndex: any, index: number) => {
    let formValues = form.getFieldValue('childrenList');
    let formValue = formValues?.[outIndex]?.innerList?.[index];
    //多选切单选
    if (formValue.operator !== 'in' && formValue.operator !== 'not in') {
      if (formValue.params instanceof Array) {
        formValue.params = formValue.params?.[0];
      }
    } else {
      //单选切多选
      if (formValue.params instanceof Array) {
        formValue.params = '';
      } else {
        if (formValue.params) {
          formValue.params = [formValue.params];
        } else {
          formValue.params = undefined;
        }
      }
    }

    form.setFieldsValue({
      childrenList: [...formValues],
    });
  };

  return (
    <div key={key}>
      <div className={style['innerform']}>
        <FormItem
          name={[key, 'subject']}
          fieldKey={[key, 'subject']}
          rules={[{ required: true, message: '请选择属性' }]}
          style={{ marginRight: '8px' }}
        >
          <Select
            style={{ width: '200px' }}
            placeholder="请选择属性"
            onChange={(val: any) => {
              changeAttribute(val);
            }}
          >
            {fieldsList.map((item: any, i: number) => {
              return (
                <Option key={i} value={item.value} opt={item}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </FormItem>

        <FormItem
          name={[key, 'operator']}
          fieldKey={[key, 'operator']}
          rules={[{ required: true, message: '请选择比较关系' }]}
          style={{ marginRight: '8px' }}
        >
          <Select
            placeholder="请比较关系"
            style={{ width: '120px' }}
            onChange={() => {
              changeOperator(outIndex, index);
            }}
          >
            {type !== 'select' && (
              <>
                <Option value={'=='}>等于</Option>
                <Option value={'!='}>不等于</Option>
                <Option value={'>='}>大于等于</Option>
                <Option value={'>'}>大于</Option>
                <Option value={'<='}>小于等于</Option>
                <Option value={'<'}>小于</Option>
                {type == 'dateTime' ? (
                  <>
                    <Option value={'between'}>介于</Option>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            {type === 'select' && (
              <>
                <Option value={'=='}>等于</Option>
                <Option value={'!='}>不等于</Option>
                <Option value={'in'}>包含</Option>
                <Option value={'not in'}>不包含</Option>
              </>
            )}
          </Select>
        </FormItem>

        {/* ---------------- 分界线 ------------- */}
        {/* 数字numbric */}
        <Condition r-if={type === 'number'}>
          <FormItem
            name={[field.name, 'params']}
            fieldKey={[field.fieldKey, 'params']}
            rules={[{ required: true, message: '请选择' }]}
            dependencies={['childrenList', 0, 'innerList', index, 'subject']}
          >
            <InputNumber style={{ width: '200px' }} placeholder="请输入" />
          </FormItem>
        </Condition>

        {/* 时间dateTime */}
        <Condition r-if={type === 'dateTime'}>
          <FormItem
            name={[field.name, 'params']}
            fieldKey={[field.fieldKey, 'params']}
            rules={[{ required: true, message: '请选择' }]}
            dependencies={['childrenList', 0, 'innerList', index, 'subject']}
          >
            {currentOp == 'between' ? <RangePicker /> : <DatePicker showTime />}
          </FormItem>
        </Condition>

        {/* string */}
        <Condition r-if={type === 'select'}>
          {/* 多选 */}
          <Condition r-if={currentOp == 'in' || currentOp == 'not in'}>
            <FormItem
              name={[field.name, 'params']}
              fieldKey={[field.fieldKey, 'params']}
              rules={[{ required: true, message: '请选择' }]}
              dependencies={['childrenList', 0, 'innerList', index, 'subject']}
            >
              <Select mode="multiple" style={{ width: '200px' }} placeholder="请选择">
                {subInnerList?.map((item: any, index: number) => (
                  <Option key={index} value={item.value}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Condition>
          {/* 单选 */}
          <Condition r-if={currentOp !== 'in' && currentOp !== 'not in'}>
            <FormItem
              name={[field.name, 'params']}
              fieldKey={[field.fieldKey, 'params']}
              rules={[{ required: true, message: '请选择' }]}
              dependencies={['childrenList', 0, 'innerList', index, 'subject']}
            >
              <Select style={{ width: '200px' }} placeholder="请选择">
                {subInnerList?.map((item: any, index: number) => (
                  <Option key={index} value={item.value}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Condition>
        </Condition>

        {/* input */}
        <Condition r-if={type === 'input'}>
          <FormItem
            name={[field.name, 'params']}
            fieldKey={[field.fieldKey, 'params']}
            rules={[{ required: true, message: '请选择' }]}
            dependencies={['childrenList', 0, 'innerList', index, 'subject']}
          >
            <Input></Input>
          </FormItem>
        </Condition>

        <FormItem>
          <MinusCircleOutlined
            onClick={() => {
              remove();
            }}
            style={{ marginLeft: '10px', fontSize: '20px', color: '#A0A0A0' }}
          />
        </FormItem>
      </div>
    </div>
  );
};

export default InnerForm;
