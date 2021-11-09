export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
      { component: './404' },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      { path: '/admin/sub-page', name: '二级管理页', icon: 'smile', component: './Welcome' },
      { component: './404' },
    ],
  },
  { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  {
    name: '测试页面',
    icon: 'QuestionCircleOutlined',
    path: '/test',
    noAuth: true,
    component: './TestPage',
    layout: false,
  },
  {
    name: '测试页面2',
    icon: 'QuestionCircleOutlined',
    path: '/test2',
    noAuth: true,
    access: 'routerAuth',
    code: '4',
    component: './TestPage',
    layout: false,
  },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
