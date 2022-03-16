import React, { useState, useEffect } from 'react';

import { Form, Space, Select, Input, InputNumber, DatePicker } from 'antd';
import Condition from '../Condition';
import { numberTypeList, arrayTypeList, stringTypeList } from '../../../model/const';
import { MinusCircleOutlined } from '@ant-design/icons';
import style from '../style.less';
import { AnyTypeAnnotation } from '@babel/types';

const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const InnerForm: React.FC<any> = (props: any) => {
  const { field, form, outIndex, remove, dictList, fieldsList } = props;
  const { key, fieldKey: index } = field;

  const [tempSubject, setTempSubject] = useState<any>();
  const curList: any = form.getFieldValue('childrenList');
  const currentFormValue: any = curList?.[outIndex] || {};
  const currentInnerValue: any = currentFormValue?.innerList[index];

  const type: any = currentInnerValue?.dataType || 'input'; // 类型
  const selectType: any = currentInnerValue?.selectType || 'single'; // 下拉选择类型

  const opList: any[] = currentInnerValue?.operatorList || [];
  const subInnerList: any[] = currentInnerValue?.subList || [];

  // 修改属性
  const changeAttribute = (val: any, type?: any) => {
    let formValues = form.getFieldValue('childrenList');
    let formValue = formValues?.[outIndex]?.innerList?.[index];
    if (type !== 'init') {
      formValue.operator = undefined;
    }

    formValue.dataType = fieldsList.find((item: any) => item.code === val)?.dataType;
    formValue.dictCode = fieldsList.find((item: any) => item.code === val)?.dictCode;

    if (formValue?.params) {
      if (tempSubject && val !== tempSubject) {
        formValue.params = undefined;
      }
    }

    form.setFieldsValue({
      childrenList: [...formValues],
    });
    setTempSubject(val);
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
      // formValue.params instanceof Array
      //   ? (formValue.params = '')
      //   : formValue.params
      //   ? (formValue.params = [formValue.params])
      //   : (formValue.params = undefined);

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

  const dictCodeTest = (tempCode: any) => {
    if (tempCode) {
      let res = dictList.find((item: any) => item.code === tempCode);
      if (res) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  const dictItem = () => {
    const tempCode = fieldsList.find((item: any) => item.code === tempSubject)?.dictCode;
    if (tempCode) {
      return dictList
        .find((item: any) => item.code === tempCode)
        ?.dicts?.map((item: any) => (
          <Option key={item.value} value={item.value}>
            {item.name}
          </Option>
        ));
    }
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
                <Option key={i} value={item.code} opt={item}>
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
            {form.getFieldValue('childrenList')[outIndex].innerList[index].dataType !==
              'string' && (
              <>
                <Option value={'=='}>等于</Option>
                <Option value={'!='}>不等于</Option>
                <Option value={'>='}>大于等于</Option>
                <Option value={'>'}>大于</Option>
                <Option value={'<='}>小于等于</Option>
                <Option value={'<'}>小于</Option>
                {form.getFieldValue('childrenList')[outIndex].innerList[index].dataType ==
                'dateTime' ? (
                  <>
                    <Option value={'between'}>介于</Option>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
            {form.getFieldValue('childrenList')[outIndex].innerList[index].dataType == 'string' &&
              dictCodeTest(
                form.getFieldValue('childrenList')[outIndex].innerList[index].dictCode,
              ) && (
                <>
                  <Option value={'=='}>等于</Option>
                  <Option value={'!='}>不等于</Option>
                  <Option value={'in'}>包含</Option>
                  <Option value={'not in'}>不包含</Option>
                </>
              )}
            {form.getFieldValue('childrenList')[outIndex].innerList[index].dataType == 'string' &&
              !dictCodeTest(
                form.getFieldValue('childrenList')[outIndex].innerList[index].dictCode,
              ) && (
                <>
                  <Option value={'=='}>等于</Option>
                  <Option value={'!='}>不等于</Option>
                </>
              )}
          </Select>
        </FormItem>

        {/* ---------------- 分界线 ------------- */}
        {/* 数字numbric */}
        <Condition
          r-if={
            form.getFieldValue('childrenList')[outIndex].innerList[index].dataType === 'numbric'
          }
        >
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
        <Condition
          r-if={
            form.getFieldValue('childrenList')[outIndex].innerList[index].dataType === 'dateTime'
          }
        >
          <FormItem
            name={[field.name, 'params']}
            fieldKey={[field.fieldKey, 'params']}
            rules={[{ required: true, message: '请选择' }]}
            dependencies={['childrenList', 0, 'innerList', index, 'subject']}
          >
            {form.getFieldValue('childrenList')[outIndex].innerList[index]?.operator ==
            'between' ? (
              <RangePicker />
            ) : (
              <DatePicker showTime />
            )}
          </FormItem>
        </Condition>

        {/* string */}
        <Condition
          r-if={
            (form.getFieldValue('childrenList')[outIndex].innerList[index].dataType === 'string' ||
              form.getFieldValue('childrenList')[outIndex].innerList[index].dataType ==
                undefined) &&
            dictCodeTest(form.getFieldValue('childrenList')[outIndex].innerList[index].dictCode)
          }
        >
          {/* 多选 */}
          <Condition
            r-if={
              form.getFieldValue('childrenList')[outIndex].innerList[index].operator == 'in' ||
              form.getFieldValue('childrenList')[outIndex].innerList[index].operator == 'not in'
            }
          >
            <FormItem
              name={[field.name, 'params']}
              fieldKey={[field.fieldKey, 'params']}
              rules={[{ required: true, message: '请选择' }]}
              dependencies={['childrenList', 0, 'innerList', index, 'subject']}
            >
              <Select mode="multiple" style={{ width: '200px' }} placeholder="请选择">
                {dictItem()}
              </Select>
            </FormItem>
          </Condition>
          {/* 单选 */}
          <Condition
            r-if={
              form.getFieldValue('childrenList')[outIndex].innerList[index].operator != 'in' &&
              form.getFieldValue('childrenList')[outIndex].innerList[index].operator != 'not in'
            }
          >
            <FormItem
              name={[field.name, 'params']}
              fieldKey={[field.fieldKey, 'params']}
              rules={[{ required: true, message: '请选择' }]}
              dependencies={['childrenList', 0, 'innerList', index, 'subject']}
            >
              <Select style={{ width: '200px' }} placeholder="请选择">
                {dictItem()}
              </Select>
            </FormItem>
          </Condition>
        </Condition>

        {/* input */}
        <Condition
          r-if={
            (form.getFieldValue('childrenList')[outIndex].innerList[index].dataType === 'string' ||
              form.getFieldValue('childrenList')[outIndex].innerList[index].dataType ==
                undefined) &&
            !dictCodeTest(form.getFieldValue('childrenList')[outIndex].innerList[index].dictCode)
          }
        >
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
