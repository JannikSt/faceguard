import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message, PageHeader, Space } from 'antd';
import request from '@/utils/request';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 4,
    },
  },
};

interface RegistrationFormProps {
  appId: number;
}

const RegistrationForm: React.FC<RegistrationFormProps> = (props: any) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const { next, setUserid } = props;

  const onFinish = async (data: any) => {
    const res = await request('/api/v1/user', {
      method: 'POST',
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      },
    });

    setLoading(false);

    if (res.status === 'ok') {
      setUserid(res.id);

      next();
      message.success(`Hey ${data.firstname}, please add a foto!`);
    } else {
      message.error(`We are sorry, something failed: ${res.response}`);
    }
  };

  const randomUser1 = () => {
    form.setFieldsValue({
      firstname: 'Max',
      lastname: 'Mustermann',
      email: 'max@muster.mail',
      password: '123456789',
      confirm: '123456789',
      agreement: true,
    });
  };

  const randomUser2 = () => {
    form.setFieldsValue({
      firstname: 'Erika',
      lastname: 'Mustermann',
      email: 'erika@muster.mail',
      password: '123456789',
      confirm: '123456789',
      agreement: true,
    });
  };

  return (
    <div>
      <PageHeader title="Sign up for FaceGuard" />
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish} // onFinish
        initialValues={{
          tier: ['free'],
          prefix: '49',
        }}
        scrollToFirstError
      >
        <Form.Item
          name="firstname"
          label="First Name"
          rules={[{ required: true, message: 'Please input your first name!' }]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="lastname"
          label="Last Name"
          rules={[{ required: true, message: 'Please input your last name!' }]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-Mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-Mail!',
            },
            {
              required: true,
              message: 'Please input your E-Mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please choose a password with a minimum length of 6 characters!',
              min: 6,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm"
          dependencies={['password']}
          hasFeedback
          // eslint-disable-next-line
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!'),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I accept the <a href="">Terms and Conditions</a>
          </Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout} style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Next
          </Button>
        </Form.Item>
      </Form>
      <div style={{ float: 'right' }}>
        <Space>
          <Button onClick={() => randomUser1()}>Max Mustermann</Button>
          <Button onClick={() => randomUser2()}>Erika Mustermann</Button>
          {/*<Button onClick={next}>Next</Button>*/}
        </Space>
      </div>
    </div>
  );
};

export default RegistrationForm;
