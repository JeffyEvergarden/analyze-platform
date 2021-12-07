import React, { useEffect, useImperativeHandle, useState } from 'react';
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
  getBehavior: any;
}

interface StatisticItemProps {
  event?: string | undefined; // 事件类型
  attribute?: string | undefined; // 属性/指标
  associatedField?: any;
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
  const { list, cref, map, getBehavior } = props;
  const [selectUserType, setSelectUserType] = useState<string>('01');

  // 筛选框 - 关联主体 - 下拉列表
  const userTypeList: any[] = [
    {
      name: '用户',
      value: '01',
    },
    {
      name: '借据',
      value: '02',
    },
    {
      name: 'BO号',
      value: '03',
    },
  ];

  // 修改事件 （传入序号） 一级属性
  const changeEvent = (index: number, val: any, opt: any) => {
    getBehavior();
    if (index < 0 || typeof index !== 'number') {
      return;
    }
    const curList = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[index] || {};
    console.log(currentFormValue);

    // 清除当前对象其他值
    currentFormValue.attribute = undefined; // 第二属性 指标
    currentFormValue.operator = undefined; // 第三属性 统计方式  // 求和、去重之类的
    currentFormValue.associatedField = undefined; // 关联主体
    currentFormValue.relation = 'AND';
    console.log(opt);
    // 指标列表
    currentFormValue.metricsList = opt.opt.metricsList || [];
    // 属性列表
    currentFormValue.fieldList = opt.opt.fieldList || [];
    //关联主体
    currentFormValue.associatedFieldsList = opt.opt.associatedFieldsList || [];

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
    console.log(curList);

    const currentFormValue: any = curList?.[outIndex] || {};
    console.log(currentFormValue);
    currentFormValue.innerList = currentFormValue.innerList || [];
    currentFormValue.innerList.push({
      attr: undefined,
      op: undefined,
      value: undefined,
      dataType: 'input',
      operatorList: [],
      subList: [],
    });
    console.log(curList);

    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  useImperativeHandle(cref, () => {
    return {
      getForm() {
        const formData = form.getFieldValue('childrenList');
        return {
          subject: formData[0]?.event,
          initEvent: formData[0]?.attribute,
          initMetric: formData[0]?.operator,
          associatedField: formData[0]?.associatedField,
          relation: formData[0]?.relation,
          conditions: formData[0]?.innerList?.map((item: any) => {
            return {
              field: item.attr,
              function: item.op,
              params: Array.isArray(item.value) ? item.value.join() : item.value,
            };
          }),
        };
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
          associatedField: undefined,
        },
      ],
    });
  }, []);

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

  // 删除最外层的form
  const delOuterForm = (outIndex: number) => {
    let curList: any = form.getFieldValue('childrenList');
    curList = curList.filter((item: any, index: number) => {
      return index !== outIndex;
    });
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  const fieldChangeFunc = (changedFields: any, allFields: any) => {
    console.log('fieldChangeFunc', changedFields);
    if (changedFields[0]?.name?.length === 5) {
      let newVal = [...changedFields[0]?.name];
      const curList: any = form.getFieldValue(newVal[0]);
      const currentFormValue: any = curList?.[newVal[1]] || {};
      currentFormValue.innerList = currentFormValue[newVal[2]] || [];
      currentFormValue.innerList[newVal[3]][newVal[4]] = changedFields[0]?.value;
      form.setFieldsValue({
        childrenList: [...curList],
      });
      // console.log('currentFormValue', currentFormValue.innerList[newVal[3]][newVal[4]]);
      // console.log(newVal?.['value']);
    }
  };

  return (
    <Form form={form} onFieldsChange={fieldChangeFunc}>
      <Form.List name="childrenList">
        {(fields, { add: addOut, remove: removeOut }) => {
          return (
            <>
              {fields.map((field: any, outIndex: number) => {
                const curItem = form.getFieldValue('childrenList')[outIndex];
                // console.log(curItem);
                const metricsList = curItem.metricsList || [];
                const fieldList = curItem.fieldList || [];
                const associatedFieldsList = curItem.associatedFieldsList || [];

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

                      {/* <MinusCircleOutlined
                        onClick={() => {
                          removeOut(outIndex);
                        }}
                        style={{ marginLeft: '10px', fontSize: '20px', color: '#A0A0A0' }}
                      /> */}

                      <PlusSquareOutlined
                        style={{ color: '#1890ff', marginLeft: '5px', fontSize: '20px' }}
                        onClick={() => {
                          addInnerForm(outIndex);
                        }}
                      />
                      <span className="label">关联主体：</span>
                      <FormItem
                        rules={[{ required: true, message: '请选择关联主体' }]}
                        name={[field.fieldKey, 'associatedField']}
                        fieldKey={[field.fieldKey, 'associatedField']}
                        className={style['zy-row']}
                        // style={{ marginLeft: '15px' }}
                      >
                        <Select
                          // value={selectUserType}
                          style={{ width: '250px' }}
                          placeholder="请选择关联主体"
                        >
                          {associatedFieldsList.map((item: any) => {
                            return (
                              <Option value={item.value} key={item.value}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>
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
