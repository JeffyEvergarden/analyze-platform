import React from 'react';
import { useModel } from 'umi';
import { Space, Button } from 'antd';
const TestPage: React.FC = (props: any) => {
  const initProps = useModel('@@initialState');

  const onClick = async () => {
    console.log(initProps);
  };

  const onClick2 = async () => {
    const fetchUserInfo = initProps?.initialState?.fetchUserInfo;
    fetchUserInfo?.();
  };

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>测试页面</div>
      <Space>
        <Button onClick={onClick}>测试1</Button>
        <Button onClick={onClick2}>测试2</Button>
      </Space>
    </div>
  );
};

export default TestPage;
