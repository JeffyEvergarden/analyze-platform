import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
// import Footer from '@/components/Footer';
import Page403 from '@/pages/403';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import routers from '../config/routes';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

const routersFilter: any[] = [];

const getNoAuthPage = (routers: any[], flag?: boolean) => {
  routers.forEach((route: any, index: number) => {
    if (route.noAuth || flag) {
      routersFilter.push(route.path);
    }
    if (route.routes) {
      getNoAuthPage(route.routes, route.noAuth || flag);
    }
  });
};
// 加入无需权限页面列表
getNoAuthPage(routers);

console.log(routersFilter);

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  routersFilter?: any[];
  hadDone?: boolean; // 表示是否初始化信息接口
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      // 回登陆界面
      history.push(loginPath);
    }
    return undefined;
  };
  console.log(`history.location.pathname: ${history.location.pathname}`);
  // 判断该页面是否需要进行抓取用户信息
  if (routersFilter.indexOf(history.location.pathname) < 0) {
    console.log('初始页面为需权限页面, 尝试抓去用户信息');
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      hadDone: true,
      routersFilter,
      currentUser, // 获取了user信息
      settings: {}, // 设置信息
    };
  }

  return {
    fetchUserInfo,
    routersFilter,
    hadDone: false,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // 加水印
    waterMarkProps: {
      // content: initialState?.currentUser?.name,
    },
    footerRender: () => '', // <Footer />
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   console.log('layout-onPageChange------');
      //   history.push(loginPath);
      // }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <Page403></Page403>,
    ...initialState?.settings,
  };
};
