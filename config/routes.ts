export default [
  {
    path: '/menu',
    layout: false,
    component: './menu-management/home',
    noAuth: true,
    routes: [
      {
        name: '公共',
        path: '/menu/public',
        component: './menu-management/home/public',
      },
      {
        name: '团队',
        path: '/menu/team',
        component: './menu-management/home/team',
      },
      {
        name: '个人',
        path: '/menu/person',
        component: './menu-management/home/person',
      },
      { redirect: '/menu/public' },
      { component: './404' },
    ],
  },
  {
    path: '/analyzehome',
    layout: false,
    component: './analyze-home/home',
    noAuth: true,
    routes: [
      {
        name: '敏捷分析-留存分析',
        path: '/analyzehome/retained',
        component: './analyze-home/retained-analyze',
      },
      { redirect: '/analyzehome/retained' },
      { component: './404' },
    ],
  },
  { path: '/', redirect: '/analyzehome', noAuth: true },
  { component: './404' },
];
