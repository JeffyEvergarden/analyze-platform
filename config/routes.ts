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
      {
        name: '敏捷分析-新广告分析',
        path: '/analyzehome/advertise',
        component: './analyze-home/advertise-analyze',
      },
      {
        name: '敏捷分析-提额&调价分析',
        path: '/analyzehome/price',
        component: './analyze-home/price-analyze',
      },
      {
        name: '敏捷分析-运营指标分析',
        path: '/analyzehome/operationIndex',
        component: './analyze-home/operation-analyze',
      },
      {
        name: '敏捷分析-常规运营指标分析',
        path: '/analyzehome/bgsevent',
        component: './analyze-home/event-analyze',
      },
      { redirect: '/analyzehome/retained' },
      { component: './404' },
    ],
  },
  {
    layout: false,
    noAuth: true,
    name: '敏捷分析-新广告分析',
    path: '/minimap/advertise',
    component: './analyze-home/template-analyze/minimap',
  },
  { path: '/', redirect: '/analyzehome', noAuth: true },
  { component: './404' },
];
