import React, { useEffect, useImperativeHandle, useState } from 'react';
// 通用组件
import { Form, Select, Button, Space, Input, Tooltip } from 'antd';

import {
  PlusSquareOutlined,
  HighlightOutlined,
  FunnelPlotOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
// 定制组件
import Condition from '../common/Condition';
import InnerFormItem from '../common/InnerFormItem';
import { statisticNumbericList, statisticDefaultList } from '../model/const';
import style from './style.less';

import { propcessInitForm } from '../../model/util';

interface StatisticComponentProps {
  cref: any;
  list: [];
  map?: Map<string, any> | undefined;
  getBehavior: any;
  change: any;
  setFilter: (...args: any[]) => void;
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
  const { list, cref, map, getBehavior, change, setFilter } = props;

  const [chooseAttribute, setChooseAttribute] = useState<any>([]);

  // 修改事件 （传入序号） 一级属性
  const changeEvent = (index: number, val: any, opt: any) => {
    // getBehavior('RETAIN_STRATEGY_NEXT', opt.value);
    if (index < 0 || typeof index !== 'number') {
      return;
    }
    const curList = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[index] || {};
    // console.log(currentFormValue);
    //清除子
    currentFormValue?.innerList?.forEach((item: any) => {
      item.attr = undefined;
      item.op = undefined;
      item.value = undefined;
    });

    // change(currentFormValue.event);

    // 清除当前对象其他值
    currentFormValue.attribute = undefined; // 第二属性 指标
    currentFormValue.operator = undefined; // 第三属性 统计方式  // 求和、去重之类的
    currentFormValue.relation = 'AND';
    // console.log(opt);
    let list = opt.opt.fieldList || [];
    setFilter?.(list || []);
    //关联主体
    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  // 修改指标
  const changeAttribute = () => {
    const curList = form.getFieldValue('childrenList');
    setChooseAttribute(curList?.[0]?.otherAttr);
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

  // 添加子筛选
  const addInnerForm = (outIndex: number) => {
    const curList: any = form.getFieldValue('childrenList');
    // console.log(curList);

    const currentFormValue: any = curList?.[outIndex] || {};
    // console.log(currentFormValue);
    currentFormValue.innerList = currentFormValue.innerList || [];
    currentFormValue.innerList.push({
      attr: undefined,
      op: undefined,
      value: undefined,
      dataType: 'input',
      operatorList: [],
      subList: [],
    });
    // console.log(curList);

    form.setFieldsValue({
      childrenList: [...curList],
    });
  };

  //添加指标
  const addAttr = (outIndex: number) => {
    const tempChildrenList: any = form.getFieldValue('childrenList') || [];

    const tempOtherList: any = tempChildrenList[outIndex]
      ? tempChildrenList[outIndex].otherAttr
      : [];

    tempOtherList.push({
      attribute: undefined,
    });

    tempChildrenList[outIndex].otherAttr = tempOtherList;

    form.setFieldsValue({
      childrenList: tempChildrenList,
    });
    // console.log(outIndex, tempChildrenList);
  };

  const removeAttr = (attrIndex: any, outIndex: number) => {
    const curList: any = form.getFieldValue('childrenList');
    const currentFormValue: any = curList?.[outIndex] || {};
    currentFormValue.otherAttr = currentFormValue.otherAttr || [];
    currentFormValue.otherAttr = currentFormValue.otherAttr.filter((item: any, index: number) => {
      return index !== attrIndex;
    });
    form.setFieldsValue({
      childrenList: [...curList],
    });
    changeAttribute();
  };

  useImperativeHandle(cref, () => {
    return {
      //获取接口所需数据
      async getForm() {
        const fieldsValue: any = await form.validateFields();
        // console.log(fieldsValue);

        if (fieldsValue) {
          const formData = form.getFieldValue('childrenList');
          return {
            initEvent: formData[0]?.event,
            initMetric: formData[0]?.otherAttr.map((item: any) => item?.attribute),
            relation: formData[0]?.relation,
            conditions: formData[0]?.innerList?.map((item: any) => {
              return {
                field: item.attr,
                function: item.op,
                params: Array.isArray(item.value)
                  ? item.value.join()
                  : item.value.format
                  ? item.value.format('YYYY-MM-DD')
                  : item.value,
                dataType: item.dataType,
              };
            }),
            firstOtherName: formData[0]?.otherAttr.map((item: any) => item?.alias),
          };
        } else {
          return false;
        }
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
        obj = propcessInitForm(obj);
        // if (obj.event) {
        //   getBehavior('RETAIN_STRATEGY_NEXT', obj.event);
        // }
        form.setFieldsValue({ childrenList: [obj] });
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
          otherAttr: [
            {
              attribute: undefined,
              alias: '',
              edit: false,
            },
          ],
          relation: 'AND',
        },
      ],
    });
  }, []);

  // 修改别名
  const changeFilterAlias = (attrIndex: any, outIndex: any) => {
    // console.log(attrIndex);

    const formValueList = form.getFieldValue('childrenList');
    const selectItem = formValueList[outIndex].otherAttr[attrIndex];
    selectItem.edit = !selectItem.edit;
    selectItem.alias = trim(selectItem.alias);
    form.setFieldsValue({
      childrenList: [...formValueList],
    });
  };

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
    // console.log('fieldChangeFunc', changedFields);
    if (changedFields[0]?.name?.[2] === 'innerList') {
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
                const _event = curItem?.event;
                const _curItemObj: any = list.find((item: any) => {
                  return item.value === _event;
                });
                // 找出下拉列表
                const metricsList: any = _curItemObj?.metricsList || [];
                const fieldList = _curItemObj?.fieldList || [];

                const type: string = curItem?.type || ''; // 判断是 指标 还是 属性
                const dataType: string = curItem?.dataType || ''; // 判断数据类型
                let subList: any[] = []; // 三级下拉列表
                if (type === 'fields' && dataType === 'number') {
                  // 下表列表
                  subList = statisticNumbericList;
                } else if (type === 'fields') {
                  subList = statisticDefaultList; // 指标列表
                }

                const attrItem = curItem?.otherAttr;

                //
                const relation = curItem?.relation;

                return (
                  <div key={field.fieldKey}>
                    {/* 前置筛选 */}
                    <Space align="baseline" style={{ marginBottom: '24px' }}>
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
                      <Form.List name={[outIndex, 'otherAttr']}>
                        {(AttrFields, { add, remove }) => {
                          return (
                            <div key={AttrFields.fieldKey}>
                              <div className={style['layout_right']}>
                                {AttrFields.map((AttrField, AttrIndex) => {
                                  // console.log('innerFields:', innerField);
                                  return (
                                    <div key={AttrIndex}>
                                      <Space align="baseline">
                                        <FormItem
                                          rules={[
                                            { required: true, message: '请选择查询指标/属性' },
                                          ]}
                                          name={[AttrField.fieldKey, 'attribute']}
                                          fieldKey={[AttrField.fieldKey, 'attribute']}
                                          style={{ width: '180px' }}
                                        >
                                          <Select
                                            placeholder="请选择查询指标/属性"
                                            onChange={changeAttribute}
                                          >
                                            {/* 指标列表 */}
                                            {metricsList.map((item: any, index: any) => {
                                              return (
                                                <Option
                                                  disabled={
                                                    chooseAttribute?.find((a: any) => {
                                                      return a?.attribute == item?.value;
                                                    })?.attribute
                                                      ? true
                                                      : false
                                                  }
                                                  key={index}
                                                  value={item.value}
                                                  opt={item}
                                                >
                                                  {item.name}
                                                </Option>
                                              );
                                            })}
                                          </Select>
                                        </FormItem>

                                        {/* 三级筛选 */}
                                        {/* <Condition r-if={type === 'fields'}>
                                          <FormItem
                                            rules={[{ required: true, message: '请选择统计方式' }]}
                                            name={[field.fieldKey, 'operator']}
                                            fieldKey={[field.fieldKey, 'operator']}
                                            style={{ width: '150px' }}
                                          >
                                            <Select placeholder="请选择统计方式">
                                             
                                              {subList.map((item: any, index: any) => {
                                                return (
                                                  <Option key={index} value={item.value} opt={item}>
                                                    {item.name}
                                                  </Option>
                                                );
                                              })}
                                            </Select>
                                          </FormItem>
                                        </Condition> */}

                                        <Condition r-if={AttrIndex != 0}>
                                          <MinusCircleOutlined
                                            onClick={() => {
                                              removeAttr(AttrIndex, outIndex);
                                            }}
                                            style={{
                                              marginLeft: '10px',
                                              fontSize: '20px',
                                              color: '#A0A0A0',
                                            }}
                                          />
                                        </Condition>
                                        <Condition r-if={AttrIndex == 0}>
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
                                        </Condition>
                                        <Condition r-if={AttrIndex == 0}>
                                          <Button
                                            style={{
                                              color: '#1890ff',
                                              marginLeft: '5px',
                                              marginTop: '2px',
                                              // fontSize: '20px',
                                              padding: 0,
                                            }}
                                            type="link"
                                            icon={<FunnelPlotOutlined />}
                                            onClick={() => {
                                              addAttr(outIndex);
                                            }}
                                          >
                                            添加指标
                                          </Button>
                                        </Condition>

                                        <Tooltip title="编辑指标别名">
                                          <HighlightOutlined
                                            style={{
                                              color: '#1890ff',
                                              marginLeft: '24px',
                                              marginTop: '2px',
                                              fontSize: '20px',
                                            }}
                                            onClick={() => {
                                              changeFilterAlias(AttrIndex, outIndex);
                                            }}
                                          />
                                        </Tooltip>
                                        <Condition r-if={attrItem?.[AttrIndex]?.edit}>
                                          <FormItem
                                            name={[AttrField.fieldKey, 'alias']}
                                            key={AttrField.fieldKey + 'alias'}
                                            fieldKey={[AttrField.fieldKey, 'alias']}
                                          >
                                            <Input
                                              style={{ width: '150px' }}
                                              placeholder="请输入别名"
                                              onPressEnter={() => {
                                                changeFilterAlias(field, outIndex);
                                              }}
                                              maxLength={20}
                                              autoComplete="off"
                                            ></Input>
                                          </FormItem>
                                        </Condition>

                                        <Condition
                                          r-if={
                                            !attrItem?.[AttrIndex]?.edit &&
                                            attrItem?.[AttrIndex]?.alias
                                          }
                                        >
                                          <div style={{ marginLeft: '15px' }}>
                                            别名：
                                            <span className={style['static-box_alias']}>
                                              {attrItem?.[AttrIndex]?.alias}
                                            </span>
                                          </div>
                                        </Condition>
                                      </Space>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }}
                      </Form.List>
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
