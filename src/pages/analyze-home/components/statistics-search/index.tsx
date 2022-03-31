import React, { useEffect, useImperativeHandle } from 'react';
// 通用组件
import { Form, Select, Button, Space, Input } from 'antd';

import { PlusSquareOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
// 定制组件
import Condition from '../common/Condition';
import InnerFormItem from '../common/InnerFormItem';
import { statisticNumbericList, statisticDefaultList } from '../model/const';
import style from './style.less';

interface StatisticComponentProps {
  cref: any;
  list: [];
  map?: Map<string, any> | undefined;
}

interface StatisticItemProps {
  event?: string | undefined; // 事件类型
  attribute?: string | undefined; // 属性/指标
  operator?: string | undefined; // 统计方式
  type?: string | undefined; //  fields/metric 属性/指标
  dataType?: string | undefined; // number/input/select/dateTime
  innerList?: any[];
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
  const { list, cref, map } = props;
  // 修改事件 （传入序号） 一级属性
  const changeEvent = (index: number, val: any, opt: any) => {
    if (index < 0 || typeof index !== 'number') {
      return;
    }
    const curList = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[index] || {};
    // 清除当前对象其他值
    currentFormValue.attribute = undefined; // 第二属性 指标
    currentFormValue.operator = undefined; // 第三属性 统计方式  // 求和、去重之类的
    currentFormValue.relation = 'AND';
    // console.log(opt);
    // 指标列表
    currentFormValue.metricsList = opt.opt.metricsList || [];
    // 属性列表
    currentFormValue.fieldList = opt.opt.fieldList || [];
    //关联主体
    // currentFormValue.associatedFieldsList = opt.opt.fieldList || [];
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  // 修改指标
  const changeAttribute = (val: any, options: any, outIndex: number) => {
    const curList = form.getFieldValue('childrenList');
    curList[outIndex].operator = undefined;
    curList[outIndex].type = options.opt.type; // 指标/属性
    curList[outIndex].dataType = options.opt.dataType; // input / select / number
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  // 修改关系
  const changeRelation = (outIndex: number) => {
    const curList: any = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[outIndex] || {};
    currentFormValue.relation = currentFormValue.relation === 'AND' ? 'OR' : 'AND';
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  // 修改别名
  const changeAlias = (index: number) => {
    const list = form.getFieldValue('childrenList');
    const currentFormValue: any = list?.[index] || {};
    // 编辑状态修改
    currentFormValue.edit = !currentFormValue.edit;
    currentFormValue.alias = trim(currentFormValue.alias);
    form.setFieldsValue({
      childrenList: [...list],
    });
  };

  // 添加子筛选
  const addInnerForm = (outIndex: number) => {
    const curList: any = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[outIndex] || {};
    currentFormValue.innerList = currentFormValue.innerList || [];
    currentFormValue.innerList.push({
      attr: undefined,
      op: undefined,
      value: undefined,
      dataType: 'input',
      operatorList: [],
      subList: [],
    });
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

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
          event: undefined,
          attribute: undefined,
          operator: undefined,
          relation: 'AND',
        },
      ],
    });
  }, []);

  return (
    <Form form={form}>
      <Form.List name="childrenList">
        {(fields, { add: addOut, remove: removeOut }) => {
          return (
            <>
              {fields.map((field: any, outIndex: number) => {
                const curItem = form.getFieldValue('childrenList')[outIndex];
                // console.log(curItem);
                // 当前所选的事件
                const _event = curItem?.event;
                const _curItemObj: any = list.find((item: any) => {
                  return item.value === _event;
                });
                const metricsList: any = _curItemObj?.metricsList || [];
                const fieldList = _curItemObj?.fieldList || [];
                const associatedFieldsList = curItem.associatedFields || [];

                const type: string = curItem.type || ''; // 判断是 指标 还是 属性
                const dataType: string = curItem.dataType || ''; // 判断数据类型
                let subList: any[] = []; // 三级下拉列表
                if (type === 'fields' && dataType === 'number') {
                  subList = statisticNumbericList;
                } else if (type === 'fields') {
                  subList = statisticDefaultList;
                }

                //
                const relation = curItem.relation;

                return (
                  <div key={field.fieldKey}>
                    {/* 前置筛选 */}
                    <Space align="baseline">
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
                            changeEvent(outIndex, val, opt);
                          }}
                        >
                          {list.map((item: any, index: number) => {
                            return (
                              <Option key={index} value={item.value} opt={item}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>

                      <span>的</span>

                      {/* 二级筛选 */}
                      <FormItem
                        rules={[{ required: true, message: '请选择查询指标/属性' }]}
                        name={[field.fieldKey, 'attribute']}
                        fieldKey={[field.fieldKey, 'attribute']}
                        style={{ width: '180px' }}
                      >
                        <Select
                          placeholder="请选择查询指标/属性"
                          onChange={(val: any, opt: any) => {
                            changeAttribute(val, opt, outIndex);
                          }}
                        >
                          {/* 指标列表 */}
                          {metricsList.map((item: any, index: any) => {
                            return (
                              <Option key={index} value={item.value} opt={item}>
                                {item.name}
                              </Option>
                            );
                          })}
                          {/* 属性列表 */}
                          {fieldList.length > 0 && (
                            <Select.OptGroup label="----">
                              {fieldList.map((item: any, index: any) => {
                                return (
                                  <Option key={`field_${index}`} value={item.value} opt={item}>
                                    {item.name}
                                  </Option>
                                );
                              })}
                            </Select.OptGroup>
                          )}
                        </Select>
                      </FormItem>
                      {/* {type} */}
                      {/* 三级筛选 */}
                      <Condition r-if={type === 'fields'}>
                        <FormItem
                          rules={[{ required: true, message: '请选择统计方式' }]}
                          name={[field.fieldKey, 'operator']}
                          fieldKey={[field.fieldKey, 'operator']}
                          style={{ width: '150px' }}
                        >
                          <Select placeholder="请选择统计方式">
                            {/* 指标列表 */}
                            {subList.map((item: any, index: any) => {
                              return (
                                <Option key={index} value={item.value} opt={item}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          </Select>
                        </FormItem>
                      </Condition>

                      <MinusCircleOutlined
                        onClick={() => {
                          removeOut(outIndex);
                        }}
                        style={{ marginLeft: '10px', fontSize: '20px', color: '#A0A0A0' }}
                      />

                      <PlusSquareOutlined
                        style={{ color: '#1890ff', marginLeft: '5px', fontSize: '20px' }}
                        onClick={() => {
                          addInnerForm(outIndex);
                        }}
                      />
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
                                    list={fieldList}
                                    map={map}
                                    remove={() => {
                                      remove(innerIndex);
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

              <div className={style['zy-row']}>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => {
                    addOut({
                      event: undefined,
                      attribute: undefined,
                      operator: undefined,
                      relation: 'AND',
                    });
                  }}
                ></Button>
                <span style={{ fontSize: '14px', marginLeft: '8px' }}>添加指标</span>
              </div>
            </>
          );
        }}
      </Form.List>
    </Form>
  );
};

export default StatisticComponent;
