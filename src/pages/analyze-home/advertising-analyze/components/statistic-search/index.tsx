import React, { useEffect, useImperativeHandle, useState } from 'react';
// 通用组件
import { Form, Select, Button, Space, Input } from 'antd';

import {
  PlusSquareOutlined,
  MinusCircleOutlined,
  HighlightOutlined,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons';
// 定制组件
import Condition from '../common/Condition';
import InnerFormItem from '../common/InnerFormItem';
import { statisticNumbericList, statisticDefaultList } from '../../model/const';
import style from './style.less';

interface StatisticComponentProps {
  cref: any;
  initData?: any;
  eventDataList: any;
  dictList: any;
  setFilter?: any;
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

const StatisticComponent: React.FC<any> = (props: StatisticComponentProps) => {
  const [form] = Form.useForm();
  const { cref, eventDataList, dictList, initData, setFilter } = props;
  const [selectUserType, setSelectUserType] = useState<string>('01');

  // 修改事件 （传入序号） 一级属性
  const changeEvent = (index: any) => {
    const formValueList = form.getFieldValue('childrenList');
    formValueList[index].attribute = undefined;
    formValueList[index].innerList = [];
    formValueList[index].relation = 'AND';
    formValueList[index].fnName = undefined;
    formValueList[index].fieldsDict = eventDataList.find(
      (item: any) => item.code === formValueList[index].event,
    )?.fields;
    form.setFieldsValue({
      childrenList: [...formValueList],
    });
    setFilter?.(form.getFieldValue('childrenList'), eventDataList);
  };

  // 修改第二个选择框
  const changeAttribute = (val: any, options: any, outIndex: number) => {
    const childrenValues = form.getFieldValue('childrenList');
    childrenValues[outIndex].fnName = undefined;
    form.setFieldsValue({
      childrenList: [...childrenValues],
    });
  };

  // 修改关系
  const changeRelation = (outIndex: number) => {
    const formValueList: any = form.getFieldValue('childrenList');
    const currentFormValue: any = formValueList?.[outIndex] || {};
    currentFormValue.relation = currentFormValue.relation === 'AND' ? 'OR' : 'AND';
    form.setFieldsValue({
      childrenList: [...formValueList],
    });
  };

  // 添加子筛选
  const addInnerForm = (outIndex: number) => {
    const formValueList: any = form.getFieldValue('childrenList') || [];
    console.log(formValueList);

    const tempInnerList: any = formValueList?.[outIndex] ? formValueList?.[outIndex].innerList : [];
    console.log(tempInnerList);

    tempInnerList?.push({
      subject: undefined,
      operator: undefined,
      params: undefined,
    });

    formValueList[outIndex].innerList = tempInnerList;
    form.setFieldsValue({
      childrenList: formValueList,
    });
  };

  const addOther = () => {
    const tempChildrenList = form.getFieldValue('childrenList') || [];
    tempChildrenList.push({
      event: undefined,
      attribute: undefined,
      relation: 'AND',
      fnName: undefined,
      innerList: [],
    });
    form.setFieldsValue({
      childrenList: [...tempChildrenList],
    });
  };

  useImperativeHandle(cref, () => {
    return {
      //获取接口所需数据
      async getForm() {
        const fieldsValue: any = await form.validateFields();
        console.log(fieldsValue);

        // if (fieldsValue) {
        //   const formData = form.getFieldValue('childrenList');
        //   return {
        //     initEvent: formData[0]?.event,
        //     initMetric: formData[0]?.attribute,
        //     associatedField: formData[0]?.associatedField,
        //     relation: formData[0]?.relation,
        //     conditions: formData[0]?.innerList?.map((item: any) => {
        //       return {
        //         field: item.attr,
        //         function: item.op,
        //         params: Array.isArray(item.value)
        //           ? item.value.join()
        //           : item.value.format
        //           ? item.value.format('YYYY-MM-DD')
        //           : item.value,
        //         dataType: item.dataType,
        //       };
        //     }),
        //   };
        // } else {
        //   return false;
        // }
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
      addStatistic: () => {
        addOther();
      },
    };
  });

  // 删除里层的form
  const delInnerForm = (innerIndex: number, outIndex: number) => {
    const curList: any = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[outIndex] || {};
    currentFormValue.innerList = currentFormValue.innerList || [];
    currentFormValue.innerList = currentFormValue.innerList.filter((item: any, index: number) => {
      return index !== innerIndex;
    });
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  const metricsSelectItem = (index: number) => {
    const tempChildrenList = form.getFieldValue('childrenList')[index] || [];
    const inUseFields: any[] = [];
    const metrics: any[] =
      eventDataList.find((item: any) => item.code == tempChildrenList?.event)?.metrics || [];
    console.log(metrics);

    return metrics.map((item: any, index: any) => {
      return (
        <Option
          disabled={inUseFields.includes(item.expression)}
          key={`m${index}`}
          value={item.expression}
        >
          {item.name}
        </Option>
      );
    });
  };

  const fieldsSelectItem = (index: number) => {
    const inUseFields: any[] = [];
    const fields: any[] =
      eventDataList.find(
        (item: any) => item.code == form.getFieldValue('childrenList')[index]?.event,
      )?.fields || [];
    return fields.map((item: any, index: any) => {
      return (
        <Option disabled={inUseFields.includes(item.code)} key={`f${index}`} value={item.code}>
          {item.name}
        </Option>
      );
    });
  };

  // 判断第二个下拉的类型 true 取 fields  false 取 metic
  const judgeAttributeType = (index: any) => {
    const formValue = form.getFieldValue('childrenList')[index];

    const fields: any =
      eventDataList?.find((item: any) => item.code === formValue?.event)?.fields || [];
    if (fields?.some((item: any) => item.code === formValue.attribute)) {
      return true;
    }
    return false;
  };

  //判断第三个选的是不是数字
  const judgeFnName = (index: number) => {
    const formValue = form.getFieldValue('childrenList')[index];
    const fields: any =
      eventDataList?.find((item: any) => item.code === formValue?.event)?.fields || [];
    if (fields?.find((item: any) => item.code === formValue.attribute)?.dataType === 'numbric') {
      return true;
    }
    return false;
  };

  const ThirdSelectItem = (index: number) => {
    return judgeFnName(index) ? (
      <>
        {statisticNumbericList?.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.name}
          </Option>
        ))}
      </>
    ) : (
      <>
        {statisticDefaultList.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.name}
          </Option>
        ))}
      </>
    );
  };

  // 修改别名
  const changeFilterAlias = (field: any, outIndex: any) => {
    const formValueList = form.getFieldValue('childrenList');
    const selectItem = formValueList[outIndex];
    selectItem.edit = !selectItem.edit;
    selectItem.alias = trim(selectItem.alias);
    form.setFieldsValue({
      childrenList: [...formValueList],
    });
  };

  useEffect(() => {
    if (eventDataList?.length > 0) {
      if (initData?.childrenList.length > 0) {
        form.setFieldsValue({
          childrenList: [...initData.chlidrenList],
        });
        setFilter?.(form.getFieldValue('childrenList'), eventDataList);
      } else {
        addOther();
      }
    }
  }, [eventDataList, initData]);

  return (
    <Form form={form}>
      <Form.List name="childrenList">
        {(fields, { add: addOut, remove: removeOut }) => {
          return (
            <>
              {fields.map((field: any, outIndex: number) => {
                const formListValue = form.getFieldValue('childrenList')[outIndex];
                // console.log(curItem);
                const fieldList = formListValue?.fieldsDict || [];
                const relation = formListValue?.relation;

                return (
                  <div key={field.fieldKey}>
                    {/* 前置筛选 */}
                    <Space align="baseline" style={{ height: '32px', marginBottom: '24px' }}>
                      {/* 一级筛选 */}
                      <FormItem
                        rules={[{ required: true, message: '请选择事件' }]}
                        name={[field.fieldKey, 'event']}
                        fieldKey={[field.fieldKey, 'event']}
                        style={{ width: '200px' }}
                      >
                        <Select
                          placeholder="请选择事件"
                          onChange={(val: any, opt: any) => {
                            changeEvent(outIndex);
                          }}
                        >
                          {eventDataList?.map((item: any, index: number) => {
                            return (
                              <Option key={index} value={item.code} opt={item}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>

                      <span>的</span>

                      {/* 二级筛选 */}
                      <FormItem
                        rules={[{ required: true, message: '请选择' }]}
                        name={[field.fieldKey, 'attribute']}
                        fieldKey={[field.fieldKey, 'attribute']}
                        style={{ width: '180px' }}
                      >
                        <Select
                          placeholder="请选择"
                          onChange={(val: any, opt: any) => {
                            changeAttribute(val, opt, outIndex);
                          }}
                        >
                          {metricsSelectItem(outIndex)}
                          <Select.OptGroup label="----">
                            {fieldsSelectItem(outIndex)}
                          </Select.OptGroup>
                        </Select>
                      </FormItem>
                      {/* {type} */}
                      {/* 三级筛选 */}
                      <Condition r-if={judgeAttributeType(outIndex)}>
                        <FormItem
                          rules={[{ required: true, message: '请选择' }]}
                          name={[field.fieldKey, 'fnName']}
                          fieldKey={[field.fieldKey, 'fnName']}
                          style={{ width: '150px' }}
                        >
                          <Select placeholder="请选择">{ThirdSelectItem(outIndex)}</Select>
                        </FormItem>
                      </Condition>

                      <MinusCircleOutlined
                        onClick={() => {
                          removeOut(outIndex);
                        }}
                        style={{ marginLeft: '10px', fontSize: '20px', color: '#A0A0A0' }}
                      />
                      <PlusSquareOutlined
                        style={{
                          color: '#1890ff',
                          marginLeft: '5px',
                          marginTop: '2px',
                          fontSize: '20px',
                        }}
                        onClick={() => {
                          addInnerForm(outIndex);
                        }}
                      />

                      <HighlightOutlined
                        style={{
                          color: '#1890ff',
                          marginLeft: '5px',
                          marginTop: '2px',
                          fontSize: '20px',
                        }}
                        onClick={() => {
                          changeFilterAlias(field, outIndex);
                        }}
                      />

                      <Condition r-if={formListValue?.edit}>
                        <FormItem
                          name={[field.fieldKey, 'alias']}
                          key={field.fieldKey + 'alias'}
                          fieldKey={[field.fieldKey, 'alias']}
                        >
                          <Input
                            style={{ width: '150px' }}
                            placeholder="请输入别名"
                            onPressEnter={() => {
                              changeFilterAlias(field, outIndex);
                            }}
                          ></Input>
                        </FormItem>
                      </Condition>

                      <Condition r-if={!formListValue?.edit && formListValue?.alias}>
                        <div style={{ marginLeft: '15px' }}>
                          别名：
                          <span className={style['static-box_alias']}>{formListValue?.alias}</span>
                        </div>
                      </Condition>
                    </Space>

                    <Form.List name={[field.fieldKey, 'innerList']}>
                      {(innerFields, { add, remove }) => {
                        return (
                          <div className={style['extra-box']}>
                            {/* 左布局放关系 */}
                            <div style={{ width: '50px' }}>
                              <Condition r-if={innerFields && innerFields.length > 1}>
                                <div className={style['layout_left']}>
                                  <button
                                    type="button"
                                    className={style['relation-button']}
                                    onClick={() => {
                                      changeRelation(outIndex);
                                    }}
                                  >
                                    {formateRelation(relation)}
                                  </button>
                                </div>
                              </Condition>
                            </div>
                            <div className={style['layout_right']}>
                              {innerFields.map((innerField, innerIndex) => {
                                // console.log('innerFields:', innerField);
                                return (
                                  <InnerFormItem
                                    key={innerField.key} // 数组key值
                                    field={innerField} // 包含name、 fieldKey
                                    outIndex={outIndex}
                                    form={form}
                                    dictList={dictList}
                                    fieldsList={fieldList}
                                    remove={() => {
                                      // remove(innerIndex);
                                      delInnerForm(innerIndex, outIndex);
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      }}
                    </Form.List>
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

export default StatisticComponent;
