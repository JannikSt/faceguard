import React, { useRef, useState } from 'react';
import { enquireScreen } from 'enquire-js';
import { Button, Form, Input, message, Modal, Result, Upload, Spin } from 'antd';
import { history } from '@@/core/history';
import {
  //PaceGuardDataSource,
  //
  //WatchDataSource,
  Banner00DataSource,
} from './data.source';
import Banner from './Banner';
//import ContentPicLeft from './ContentPicLeft';
//import ContentPicRight from './ContentPicRight';
import './less/antMotionStyle.less';
import WebCam from '@/components/Webcam';
import reqwest from 'reqwest';
import request from 'umi-request';
import { UploadOutlined } from '@ant-design/icons';

export default function Home() {
  const [isLoginModalVisisble, setIsLoginModalVisisble] = useState(false);
  const [img, setImage] = useState<any>(); //Base64 of photo
  const [isWebCamVisible, setIsWebCamVisible] = useState(false);
  const [webCamLoading, setWebCamLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userid, setUserid] = useState('');
  const [imgObject, setImageObject] = useState<any>();
  const [predictionName, setPredictionName] = useState<any>();
  const [showFail, setShowFail] = useState(false);
  const [predictionProb, setPredictionProb] = useState<any>();

  let isMobile: boolean = false;
  enquireScreen((b: boolean) => {
    isMobile = b;
  });

  function getStarted() {
    history.push('/register');
  }

  const login = () => {
    setIsLoginModalVisisble(true);
  };

  const submit = (imgObject1: any) => {
    setSubmitLoading(true);
    const formData = new FormData();
    formData.append('file', imgObject1);
    formData.append('userid', userid);
    //formData.append('id');

    //TODO CHECK WHATS RETURN AND CHANGE TO LOGIN SUCCEEDED OR NOT
    reqwest({
      url: '/api/v1/predict',
      method: 'post',
      processData: false,
      data: formData,
      success: (res: any) => {
        setSubmitLoading(false);
        setIsLoginModalVisisble(false);
        setIsWebCamVisible(false);
        res.isMatching ? setShowSuccess(true) : setShowFail(true);
      },
      error: () => {
        setSubmitLoading(false);
        message.error('Upload failed.');
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('Form upload failed', errorInfo);
  };

  const handleCancel = () => {
    setIsLoginModalVisisble(false);
    setIsWebCamVisible(false);
    setShowSuccess(false);
    setShowFail(false);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const webCamRef = React.useRef(null);

  const capture = () => {
    const image = webCamRef.current.getScreenshot({
      width: 1920,
      height: 1080,
    });

    setImage(image);

    function urltoFile(url, mimeType) {
      return fetch(url)
        .then(function (res) {
          return res.arrayBuffer();
        })
        .then(function (buf) {
          return new File([buf], 'webcam_foto.jpg', { type: mimeType });
        });
    }

    urltoFile(image, 'image/jpeg').then(function (file) {
      if (file) {
        setSubmitLoading(true);
        submit(file);
      } else {
        message.error(`No photo has been taken. Please retry.`);
      }
    });
  };

  const onFinish = async (data: any) => {
    const res = await request('/api/v1/login', {
      method: 'POST',
      data: {
        email: data.email,
        password: data.password,
      },
    });

    if (res.status === 'ok') {
      setUserid(res.data._id);
      setPredictionName(res.data.firstname);
      setIsWebCamVisible(true);
    } else {
      message.error(`Login failed: ${res.response}`);
    }
  };

  function getBase64(imgObject: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(imgObject);
  }

  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg'; // || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    if (isLt2M && isJpgOrPng) {
      setImageObject(file);
      getBase64(file, (imageUrl: any) => {
        setImage(imageUrl);
      });
      //setUploadedFoto(true);
    }
    //console.log(img);

    if (isLt2M && isJpgOrPng) submit(file);
    return isLt2M && isJpgOrPng;
  }

  const retryLogin = () => {
    setIsWebCamVisible(true);
    setShowFail(false);
  };

  return (
    <div>
      <Modal
        onCancel={handleCancel}
        title="FaceGuard Login"
        visible={isLoginModalVisisble}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="E-Mail"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {isWebCamVisible && (
        <Spin spinning={submitLoading} tip="Loading...">
          <Modal
            onCancel={handleCancel}
            title="Webcam"
            visible={isWebCamVisible}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={submitLoading}
                onClick={capture}
                disabled={webCamLoading}
              >
                Capture
              </Button>,
              <Upload showUploadList={false} beforeUpload={beforeUpload}>
                <Button
                  //style={{ width: 200, position: 'absolute', bottom: 50, right: 0 }}
                  //shape="round"
                  loading={submitLoading}
                >
                  <UploadOutlined />
                  Upload
                </Button>
              </Upload>,
            ]}
          >
            <WebCam
              webCamRef={webCamRef}
              webCamLoading={webCamLoading}
              setWebCamLoading={setWebCamLoading}
              height="90%"
              width="100%"
            />
          </Modal>
        </Spin>
      )}
      <Modal
        onCancel={handleCancel}
        title="Login successfull"
        visible={showSuccess}
        footer={[
          <Button key="back" onClick={handleCancel}>
            End
          </Button>,
        ]}
      >
        <Result
          key="success"
          status="success"
          title="Successfully logged in to FaceGuard!"
          subTitle={`Welcome back ${predictionName}. Thanks for using FaceGuard, the best 2FA!`}
        />
      </Modal>
      <Modal
        onCancel={handleCancel}
        title="Login failed"
        visible={showFail}
        footer={[
          <Button key="back" onClick={handleCancel}>
            End
          </Button>,
          <Button key="retry" onClick={retryLogin}>
            Retry
          </Button>,
        ]}
      >
        <Result
          status="error"
          title="Authentification failed!"
          subTitle={`We could not identify you. Please try again.`}
          key="fail"
        />
      </Modal>
      <Banner
        id="Banner0_0"
        key="Banner0_0"
        dataSource={Banner00DataSource}
        isMobile={isMobile}
        login={login}
        getStarted={getStarted}
      />
    </div>
  );
}
