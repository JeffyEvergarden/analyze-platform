import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoAuthPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="你暂无权限查看"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Back Home
      </Button>
    }
  />
);

export default NoAuthPage;
