import React, { useState, useEffect } from 'react';
import Header from '../home/components/header';
import style from './style.less';
import { Button, Table, ConfigProvider, Modal, message, Input } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import Condition from '../home/components/Condition';
import { useIpModel } from './model';
import { useCallback } from 'react';

// 统一门户-菜单管理

const LinkManagement: React.FC<any> = (props: any) => {
  const { list, setList, loading, getIpList, addIpAddress, deleteIpAddress } = useIpModel();

  const [current, setCurrent] = useState<number>(1);
  const [visible, setVisible] = useState<boolean>(false);

  const onChange = (val: number) => {
    setCurrent(val);
  };

  const deleteIp = async (id: any, index: number) => {
    let i: number = (current - 1) * 10 + index;
    console.log('删除序列', i);
    let res: any = await deleteIpAddress(id);
    if (res) {
      list.splice(i, 1);
      setList([...list]);
    }
  };

  const addIp = async (id: any) => {
    let res: any = await addIpAddress(id);
    if (res?.id) {
      list.unshift({
        id: res.id,
        ip: res.ip,
      });
      setVisible(false);
      setList([...list]);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
    },
    {
      title: '操作',
      dataIndex: 'op',
      width: 180,
      render: (val: any, row: any, index: number) => {
        return (
          <Button
            type="link"
            danger
            onClick={() => {
              deleteIp(row.id, index);
            }}
          >
            删除
          </Button>
        );
      },
    },
  ];

  const [inputVal, setInputVal] = useState<any>('');

  const openEditModal = () => {
    setVisible(true);
    setInputVal('');
  };

  const onChangeInput = (e: any) => {
    setInputVal(e.target.value);
  };

  const handleOk = () => {
    if (!inputVal) {
      message.warning('请填写ip地址');
      return null;
    }
    addIp(inputVal);
  };

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    getIpList();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['menu-home_bg']}>
        <Header title="大数据服务门户" hidden={true} />

        <div className={style['menu-box']}>
          <div className={style['menu-right']}>
            {/* 标题 */}
            <div className={style['content-title']}>白名单IP管理</div>
            {/* 按钮组 */}
            <div className={style['content-operator']}>
              <Button onClick={openEditModal}>新增链接</Button>
            </div>

            {/* 表格 */}
            <div className={style['table-box']}>
              <Table
                pagination={{ current, onChange }}
                dataSource={list}
                columns={columns}
                rowKey="id"
                loading={loading}
              />
            </div>

            <Modal title="添加新ip地址" visible={visible} onOk={handleOk} onCancel={handleCancel}>
              <div className={style['zy-row']}>
                <span className={style['label']}>新ip地址:</span>
                <Input
                  placeholder="请输入ip地址"
                  value={inputVal}
                  onChange={onChangeInput}
                  style={{ width: '280px' }}
                />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LinkManagement;
