import React, { useState, useEffect, useRef } from 'react';
import Header from '../home/components/header';
import style from './style.less';
import { Button, Table, ConfigProvider, Row } from 'antd';
import { useMenuModel, useTableModel } from './model';
import MyTree from './components/tree';
import zhCN from 'antd/lib/locale/zh_CN';
import Condition from '../home/components/Condition';
import LinkModal from './components/link-modal';

// 统一门户-菜单管理

const MenuManagement: React.FC<any> = (props: any) => {
  // 菜单列表
  const { menuList, getMenuList } = useMenuModel();
  // 表格数据源
  const {
    tableList, // 表格数据源
    setTableList,
    tableLoading,
    getTableList,
    opLoading, // 操作的loading
    addModuleLink, // 增加链接
    deleteModuleLink, // 删除链接
  } = useTableModel();

  // 标题
  const [title, setTitle] = useState<string>('业务量');

  // 分页相关 ---
  const [current, setCurrent] = useState<number>(1);

  const onChange = (val: number) => {
    setCurrent(val);
  };

  // 添加链接
  const addLink = async (obj: any) => {
    let res: any = await addModuleLink(obj);
    if (res.id) {
      setTableList([...tableList, res]);
    }
  };

  // 删除链接
  const deleteLink = async (row: any, index: number) => {
    let i: number = (current - 1) * 10 + index;
    console.log('删除序列', i);
    let res: any = await deleteModuleLink({ id: row.id });
    if (res) {
      tableList.splice(i, 1);
      setTableList([...tableList]);
    }
  };
  // 表格列名
  const columns = [
    {
      title: '链接名称',
      dataIndex: 'title',
    },
    {
      title: '缩略图',
      dataIndex: 'icon',
      render: (val: any, row: any) => {
        if (!row.icon) {
          return null;
        } else {
          return <img src={row.icon} className={style['icon']} alt="无法识别" />;
        }
      },
    },
    {
      title: '链接名称',
      dataIndex: 'link',
    },
    {
      title: '操作',
      dataIndex: 'op',
      render: (val: any, row: any, index: number) => {
        return (
          <Button
            type="link"
            danger
            onClick={() => {
              deleteLink(row, index);
            }}
          >
            删除
          </Button>
        );
      },
    },
  ];

  // 树形选择结果
  const onSelect = (...args: any[]) => {
    // 输出树形选择结果
    console.log(args);
    // getTableList
  };

  // 弹窗相关
  const linkModalRef = useRef<any>({});

  const openAddModal = () => {
    (linkModalRef.current as any)?.open();
  };

  const openEditModal = () => {};

  // 初始化 mounted
  useEffect(() => {
    getMenuList();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['menu-home_bg']}>
        <Header title="大数据服务门户" />

        <div className={style['menu-box']}>
          <div className={style['menu-left']}>
            <div className={style['button_add']}>新增模块</div>
            <MyTree data={menuList} />
          </div>

          <div className={style['menu-right']}>
            {/* 有选中值 */}
            <Condition r-if={title}>
              {/* 标题 */}
              <div className={style['content-title']}>{title}</div>
              {/* 按钮组 */}
              <div className={style['content-operator']}>
                <Button onClick={openAddModal}>新增链接</Button>
                <div className={style['right']}>
                  {/* <Button style={{ marginRight: '16px' }}>取消</Button>
                  <Button type="primary">保存</Button> */}
                </div>
              </div>

              {/* 表格 */}
              <div className={style['table-box']}>
                <Table
                  pagination={{ current, onChange }}
                  dataSource={tableList}
                  columns={columns}
                  rowKey="index"
                  loading={tableLoading}
                  // components={{
                  //   body: {
                  //     wrapper: this.DraggableContainer,
                  //     row: this.DraggableBodyRow,
                  //   },
                  // }}
                />
              </div>
            </Condition>
          </div>

          <LinkModal cref={linkModalRef} />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default MenuManagement;
