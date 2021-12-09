import { extend } from 'umi-request';
import { message } from 'antd';

const request = extend({
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'multipart/form-data',
  // },
  // params: {
  //   token: 'xxx', // 所有请求默认带上 token 参数
  // },
  errorHandler: function (error: any) {
    // 捕获错误
    console.log('捕获错误');
    // console.log(error);
    // console.log(Object.keys(error));
    // console.log(Object.keys(error).map((it: any) => error[it]));
    // 权限无验证 跳转 统一认证页面
    if (error?.response.status === 401) {
      window.location.href = '/bgs/login';
    }
    if (error?.type === 'Timeout') {
      message.warning('请求超时');
    }
    return error;
    /* 异常处理 */
  },
});

export { request };
