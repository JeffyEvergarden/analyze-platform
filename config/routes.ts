export default [
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
      { component: './404' },
    ],
  },
  { path: '/', redirect: '/analyzehome/retained' },
  { component: './404' },
];
