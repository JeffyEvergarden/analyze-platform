import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Form, Select, message, Modal, Input, TreeSelect } from 'antd';
import { getTreeSelect } from '../util';

interface SaveRecordModalProps {
  [name: string]: any;
}

const SaveRecordModal = (props: SaveRecordModalProps) => {
  const { cref, onSave } = props;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [type, setType] = useState<string>('create');
  const [moduleName, setModuleName] = useState<string>();
  const [treeSelectId, setTreeSelectId] = useState<string>();
  const [treeSelectOptions, setTreeSelectOptions] = useState<any[]>([]);

  useImperativeHandle(cref, () => ({
    open: (params: any) => {
      if (params?.moduleName) {
        setType('edit');
        setTreeSelectId(String(params?.dashboardId));
        setModuleName(String(params?.moduleName));
      } else {
        setType('create');
        setTreeSelectId('');
        setModuleName('');
      }
      setModalVisible(true);
    },
    close: (params: any) => {
      setModalVisible(false);
    },
  }));

  const saveModalData = async () => {
    if (!moduleName) {
      message.warning('请填写分析看板名称');
      return;
    }
    if (!treeSelectId) {
      message.warning('请选择目录');
      return;
    }
    onSave?.({
      analysisName: moduleName,
      analysisBoard: treeSelectId,
    });
  };

  const getTreeOptions = async () => {
    const data = await getTreeSelect();

    setTreeSelectOptions(data);
  };

  const changeInput = (e: any) => {
    let val = e.target.value;
    if (val) {
      val = val.trim();
    }
    setModuleName(val);
  };

  useEffect(() => {
    getTreeOptions();
  }, []);

  return (
    <Modal
      style={{ top: 50 }}
      visible={modalVisible}
      onOk={saveModalData}
      onCancel={() => setModalVisible(false)}
      // confirmLoading={loading}
      okText="保存"
      cancelText="取消"
      destroyOnClose
      title={`保存分析模板`}
    >
      {/* <div className={style['record-row']}>
        <span className={style['red']}>*</span>
        <span className={style['label']}>分析看板名称</span> */}
      <Input
        placeholder="请输入分析模板名字"
        value={moduleName}
        onChange={changeInput}
        maxLength={30}
        style={{ width: '300px' }}
      ></Input>
      {/* </div> */}

      {/* <div className={style['record-row']} style={{ marginTop: '10px' }}>
        <span className={style['red']}>*</span>
        <span className={style['label']}>选择目录</span> */}
      <div style={{ clear: 'both', marginTop: '10px' }}>
        <TreeSelect
          style={{ width: '300px' }}
          showSearch
          dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
          defaultValue={treeSelectId}
          value={treeSelectId}
          treeData={treeSelectOptions}
          placeholder="选择看板"
          treeDefaultExpandAll
          onChange={(value: any) => {
            console.log(value);
            setTreeSelectId(value);
          }}
          treeNodeFilterProp="title"
        ></TreeSelect>
      </div>

      {/* </div> */}
    </Modal>
  );
};

export default SaveRecordModal;
