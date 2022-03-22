import React, { useEffect, useImperativeHandle, useState } from 'react';
// 通用组件
import { Form, Select, Button, Space, Input, InputNumber, DatePicker } from 'antd';

import { PlusSquareOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// 定制组件
import Condition from '../common/Condition';

interface GlobalComponentProps {
  cref: any;
  fieldMap?: any;
  initData?: any;
  list?: any;
}

const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

const GlobalComponent: React.FC<any> = (props: GlobalComponentProps) => {
  const [form] = Form.useForm();
  const { cref, fieldMap, list } = props;
  const [paramsTypeList, setParamsTypeList] = useState<('String' | 'Array')[]>([]);

  // 新增全局筛选
  const addOuter = () => {
    const tempChildrenList = form.getFieldValue('childrenList') || [];
    tempChildrenList.push({
      subject: undefined,
      operator: undefined,
      params: undefined,
    });
    form.setFieldsValue({
      childrenList: [...tempChildrenList],
    });
  };

  // 修改事件 （传入序号） 一级属性
  const changeSubject = (val: any, outIndex: any) => {
    const formValues = form.getFieldValue('childrenList');
    const formValue = formValues?.[outIndex];
    formValue.operator = undefined;
    formValue.params = undefined;
    formValue.dataType = list.find((item: any) => item.code === val)?.dataType;
    formValue.dictCode = list.find((item: any) => item.code === val)?.dictCode;

    form.setFieldsValue({
      childrenList: [...formValues],
    });
  };

  // 修改指标
  const changeAttribute = (val: any, outIndex: number) => {
    const formValues = form.getFieldValue('childrenList');
    const formValue = formValues?.[outIndex];

    if (val === 'in' || val === 'not in') {
      let tempArr: any = paramsTypeList;
      tempArr[outIndex] = 'Array';
      setParamsTypeList([...tempArr]);
    } else {
      let tempArr: any = paramsTypeList;
      tempArr[outIndex] = 'String';
      setParamsTypeList([...tempArr]);
    }

    if (
      (typeof formValue.params === 'string' && val === 'in') ||
      (val !== 'in' && formValue.params instanceof Array)
    ) {
      formValue.params = undefined;
    }
    form.setFieldsValue({
      childrenList: [...formValues],
    });
  };

  useImperativeHandle(cref, () => {
    return {
      //获取接口所需数据
      async getForm() {
        const fieldsValue: any = await form.validateFields();
        console.log(fieldsValue);
        return fieldsValue;
      },
      //获取当前表单选择数据
      async getFormData() {
        const fieldsValue: any = await form.validateFields();
        // console.log(fieldsValue);

        if (fieldsValue) {
          const formData = form.getFieldValue('childrenList')[0];
          return { first: formData };
        } else {
          return false;
        }
      },
      //数据回显
      async setForm(obj: any) {
        form.setFieldsValue({ childrenList: [obj] });
      },
      addGlobal: () => {
        addOuter();
      },
    };
  });

  // 初始化
  useEffect(() => {
    // 数据初始化
    form.setFieldsValue({
      childrenList: [
        {
          subject: undefined,
          operator: undefined,
          params: undefined,
        },
      ],
    });
  }, []);

  const fieldChangeFunc = (changedFields: any, allFields: any) => {
    // console.log('fieldChangeFunc', changedFields);
    if (changedFields[0]?.name?.length === 5) {
      let newVal = [...changedFields[0]?.name];
      const curList: any = form.getFieldValue(newVal[0]);
      const currentFormValue: any = curList?.[newVal[1]] || {};
      currentFormValue.innerList = currentFormValue[newVal[2]] || [];
      currentFormValue.innerList[newVal[3]][newVal[4]] = changedFields[0]?.value;
      form.setFieldsValue({
        childrenList: [...curList],
      });
    }
  };

  return (
    <Form form={form} onFieldsChange={fieldChangeFunc}>
      <Form.List name="childrenList">
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field: any, outIndex: number) => {
                const formListValue = form.getFieldValue('childrenList');
                const _currentSubject = formListValue[outIndex].subject;
                const _currentOp = formListValue[outIndex].operator;

                const _currentSubjectObj = list.find((item: any) => {
                  return item.value === _currentSubject;
                });
                const dataType = _currentSubjectObj?.dataType;

                const subList = _currentSubjectObj?.list || [];

                return (
                  <div key={field.fieldKey}>
                    {/* 前置筛选 */}
                    <Space align="baseline" style={{ height: '32px', marginBottom: '24px' }}>
                      {/* 一级筛选 */}
                      <FormItem
                        rules={[{ required: true, message: '请选择事件' }]}
                        name={[field.fieldKey, 'subject']}
                        fieldKey={[field.fieldKey, 'subject']}
                        style={{ width: '200px' }}
                      >
                        <Select
                          placeholder="请选择事件"
                          onChange={(val: any, opt: any) => {
                            changeSubject(val, outIndex);
                          }}
                        >
                          {list?.map((item: any, index: number) => {
                            return (
                              <Option key={index} value={item.value} opt={item}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>

                      {/* 二级筛选 */}
                      <FormItem
                        rules={[{ required: true, message: '请选择' }]}
                        name={[field.fieldKey, 'operator']}
                        fieldKey={[field.fieldKey, 'operator']}
                        style={{ width: '180px' }}
                      >
                        <Select
                          placeholder="请选择"
                          onChange={(val: any) => {
                            changeAttribute(val, outIndex);
                          }}
                        >
                          {dataType !== 'select' && (
                            <>
                              <Option value={'=='}>等于</Option>
                              <Option value={'!='}>不等于</Option>
                              <Option value={'>='}>大于等于</Option>
                              <Option value={'>'}>大于</Option>
                              <Option value={'<='}>小于等于</Option>
                              <Option value={'<'}>小于</Option>
                              {dataType == 'dateTime' ? (
                                <>
                                  <Option value={'between'}>介于</Option>
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          )}
                          {dataType == 'select' && (
                            <>
                              <Option value={'=='}>等于</Option>
                              <Option value={'!='}>不等于</Option>
                              <Option value={'in'}>包含</Option>
                              <Option value={'not in'}>不包含</Option>
                            </>
                          )}
                        </Select>
                      </FormItem>

                      {/* 数字number */}
                      <Condition r-if={dataType === 'number'}>
                        <FormItem
                          name={[field.name, 'params']}
                          key={field.fieldKey + 'params'}
                          fieldKey={[field.fieldKey, 'params']}
                          rules={[{ required: true, message: '请选择' }]}
                          dependencies={['childrenList', outIndex, 'subject']}
                        >
                          <InputNumber style={{ width: '200px' }} placeholder="请输入" />
                        </FormItem>
                      </Condition>

                      {/* 时间dateTime */}
                      <Condition r-if={dataType === 'dateTime'}>
                        <FormItem
                          name={[field.name, 'params']}
                          key={field.fieldKey + 'params'}
                          fieldKey={[field.fieldKey, 'params']}
                          rules={[{ required: true, message: '请选择' }]}
                          dependencies={['childrenList', outIndex, 'subject']}
                        >
                          {formListValue[outIndex].operator == 'between' ? (
                            <RangePicker />
                          ) : (
                            <DatePicker showTime />
                          )}
                        </FormItem>
                      </Condition>

                      {/* string */}
                      <Condition r-if={dataType === 'select'}>
                        {/* 多选 */}
                        <Condition
                          r-if={
                            formListValue[outIndex].operator == 'in' ||
                            formListValue[outIndex].operator == 'not in'
                          }
                        >
                          <FormItem
                            name={[field.name, 'params']}
                            key={field.fieldKey + 'params'}
                            fieldKey={[field.fieldKey, 'params']}
                            rules={[{ required: true, message: '请选择' }]}
                            dependencies={['childrenList', outIndex, 'subject']}
                          >
                            <Select mode="multiple" style={{ width: '200px' }} placeholder="请选择">
                              {subList?.map((item: any) => (
                                <Option key={item.value} value={item.value}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          </FormItem>
                        </Condition>
                        {/* 单选 */}
                        <Condition
                          r-if={
                            formListValue[outIndex].operator != 'in' &&
                            formListValue[outIndex].operator != 'not in'
                          }
                        >
                          <FormItem
                            name={[field.name, 'params']}
                            key={field.fieldKey + 'params'}
                            fieldKey={[field.fieldKey, 'params']}
                            rules={[{ required: true, message: '请选择' }]}
                            dependencies={['childrenList', outIndex, 'subject']}
                          >
                            <Select style={{ width: '200px' }} placeholder="请选择">
                              {subList?.map((item: any) => (
                                <Option key={item.value} value={item.value}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          </FormItem>
                        </Condition>
                      </Condition>

                      {/* input */}
                      <Condition r-if={dataType === 'input'}>
                        <FormItem
                          name={[field.name, 'params']}
                          key={field.fieldKey + 'params'}
                          fieldKey={[field.fieldKey, 'params']}
                          rules={[{ required: true, message: '请选择' }]}
                          dependencies={['childrenList', outIndex, 'subject']}
                        >
                          <Input></Input>
                        </FormItem>
                      </Condition>

                      <FormItem>
                        {outIndex > 0 && (
                          <MinusCircleOutlined
                            onClick={() => {
                              remove(outIndex);
                            }}
                          />
                        )}
                      </FormItem>
                    </Space>
                  </div>
                );
              })}
            </>
          );
        }}
      </Form.List>
    </Form>
  );
};

export default GlobalComponent;
