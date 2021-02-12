import React from 'react';
import { Card, Col, Layout, Row, Steps } from 'antd';
import Form from './components/Form';
import FormFoto from './components/FormFoto';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';

export default function App(props: any) {
  const { Content } = Layout;
  const { Step } = Steps;
  const [current, setCurrent] = React.useState(0);
  const [userid, setUserid] = React.useState('');

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const { appId } = props.match.params;

  return (
    <Content>
      <div style={{ backgroundColor: 'white' }}>
        <Card style={{ maxWidth: 600, margin: '0 auto' }} bordered={false}>
          <Steps current={current}>
            <Step title="Account" description="Your Account Details" />
            <Step
              //status="finish"
              title="Your Picture"
              description="Used for Login"
              icon={<UserOutlined />}
            />
          </Steps>
        </Card>
        {current === 0 && (
          <Card style={{ maxWidth: 600, margin: '0 auto' }} bordered={false}>
            <Form next={next} prev={prev} setUserid={setUserid} />
          </Card>
        )}
        {current === 1 && (
          <Card style={{ maxWidth: 600, margin: '0 auto' }} bordered={false}>
            <FormFoto next={next} prev={prev} userid={userid} />
          </Card>
        )}
      </div>
    </Content>
  );
}
