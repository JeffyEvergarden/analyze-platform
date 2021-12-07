import React, { useState, useEffect, useRef } from 'react';
import Header from './components/common/header';
import style from './style.less';
import { Button, Table, ConfigProvider, message } from 'antd';
import { useMenuModel, useTableModel } from './model';
import MyTree from './components/tree';
import zhCN from 'antd/lib/locale/zh_CN';
import Condition from './components/common/Condition';
import LinkModal from './components/link-modal';
import DirModal from './components/dir-modal';

// 统一门户-菜单管理

const MenuManagement: React.FC<any> = (props: any) => {
  // 菜单列表
  const { menuList, getMenuList, addDir, updateDir, addBoard, updateBoard } = useMenuModel();
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
  const [title, setTitle] = useState<string>('');
  const [parentId, setParentId] = useState<string>('');

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

  // 跳转
  const goToEditPage = (row: any, index: number) => {};

  // 表格列名
  const columns = [
    {
      title: '链接名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '链接名称',
      dataIndex: 'url',
    },
    {
      title: '操作',
      dataIndex: 'op',
      render: (val: any, row: any, index: number) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                goToEditPage(row, index);
              }}
              style={{ marginRight: '8px' }}
            >
              编辑
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                deleteLink(row, index);
              }}
            >
              删除
            </Button>
          </>
        );
      },
    },
  ];

  // 树形选择结果
  const onSelect = (...args: any[]) => {
    // 输出树形选择结果
    console.log(args);
    // 输出树形选择结果
    console.log('输出树形选择结果');
    let node: any = args[1]?.node || {};
    console.log(node);
    let params = {
      parentId: node?.key || node?.id || undefined,
    };
    setParentId(node?.key || node?.id || undefined);
    setTitle(node?.title || '');
    if (!params.parentId) {
      message.warning('获取不到该节点ID');
      return;
    }
    setCurrent(1);
    getTableList(params);
  };

  // 目录弹窗相关
  const dirModalRef = useRef<any>({});
  // 打开弹窗
  const openAddDirModal = (...args: any[]) => {
    (dirModalRef.current as any).open();
  };
  // 确认目录信息 (创建/编辑)
  const confirmDirInfo = async (info: any) => {
    console.log(info);
    let params: any = {
      ...info.form,
      // dirType: '', // 待填
    };
    if (info._openType === 'new') {
      let res: any = await addDir(params);
    } else if (info._openType === 'edit') {
      params.dirId = info?._originInfo?.id || '';
      let res: any = await updateDir(params);
    }
    (dirModalRef.current as any).close();
  };

  // 看板弹窗相关
  const boardModalRef = useRef<any>({});

  const openAddBoardModal = (info: any) => {
    console.log('创建看板--------');
    console.log(info);
    (boardModalRef.current as any).open({ parent: info });
  };

  const confirmBoardInfo = async (info: any) => {
    console.log('确认看板--------');
    console.log(info);
    let params: any = {
      ...info.form,
    };
    if (info._openType === 'new') {
      params.dirId = info?._originInfo?.parent?.id || '';
      let res: any = await addBoard(params);
    } else if (info._openType === 'edit') {
      params.dashboardId = info?._originInfo?.id || '';
      let res: any = await updateBoard(params);
    }
    (boardModalRef.current as any).close();
  };

  // 看板弹窗相关
  const linkModalRef = useRef<any>({});

  // 打开新弹窗
  const openAddModal = () => {
    (linkModalRef.current as any)?.open();
  };

  // 打开编辑
  const openEditModal = (row: any) => {
    console.log(row);
    if (row.level === 1) {
      // 目录级
      (dirModalRef.current as any).open(row);
    } else {
      //
      console.log('打开其他层级');
      (boardModalRef.current as any).open(row);
    }
  };

  // 切换父节点
  const touchChangeParent = () => {};

  // 初始化 mounted
  useEffect(() => {
    getMenuList();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['menu-home_bg']}>
        <Header title="敏捷分析统一看板" hidden />

        <div className={style['menu-box']}>
          <div className={style['menu-left']}>
            <div className={style['button_add']} onClick={openAddDirModal}>
              新增目录
            </div>
            <MyTree
              data={menuList}
              onChange={onSelect}
              touchChangeParent={touchChangeParent}
              deleteApi={deleteLink} // 删除api
              openEditModal={openEditModal}
              openAddModal={openAddBoardModal}
            />
          </div>

          <div className={style['menu-right']}>
            {/* 有选中值 */}
            <Condition r-if={title}>
              {/* 标题 */}
              <div className={style['content-title']}>{title}</div>
              {/* 按钮组 */}
              <div className={style['content-operator']}>
                <Button onClick={openAddModal}>新增分析</Button>
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
                />
              </div>
            </Condition>
          </div>

          {/* 链接 */}
          <LinkModal cref={linkModalRef} />

          {/* 目录弹窗 */}
          <DirModal cref={dirModalRef} confirm={confirmDirInfo} />

          <DirModal
            name={'看板'}
            nameKey={'dashboardName'}
            cref={boardModalRef}
            confirm={confirmBoardInfo}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default MenuManagement;
