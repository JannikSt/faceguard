import React, { useState } from 'react';
import { Form, Input, Button, Modal, message, Card, Image, Spin } from 'antd';
import reqwest from 'reqwest';
import WebCam from '@/components/Webcam';
import "./styles.less"

export default function Start() {
  const [isLoginModalVisisble, setIsLoginModalVisisble] = useState(false);
  const [img, setImage] = useState<any>(); //Base64 of photo
  const [isWebCamVisible, setIsWebCamVisible] = useState(false);
  const [webCamLoading, setWebCamLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);

  const [predictionsLoading, setPredictionsLoading] = useState<any>(true);
  const [predictionName, setPredictionName] = useState<any>();
  const [predictionProb, setPredictionProb] = useState<any>();

  const submit = (imgObject: any) => {
    setSubmitLoading(true);
    const formData = new FormData();
    formData.append('file', imgObject);
    reqwest({
      url: '/api/v1/predict',
      method: 'post',
      processData: false,
      data: formData,
      success: (res: any) => {
        console.log('RES', res);
        setSubmitLoading(false);
        setIsLoginModalVisisble(false);
        setShowPrediction(true);
        setPredictionName(res.data.name);
        setPredictionProb(`${Math.round(res.data.confidence)}%`);
        setPredictionsLoading(false);
      },
      error: () => {
        setSubmitLoading(false);
        message.error('Upload failed.');
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const showLoginModal = () => {
    setIsLoginModalVisisble(true);
    //setImageVisisable(false);
  };

  const handleCancel = () => {
    setIsLoginModalVisisble(false);
    setIsWebCamVisible(false);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const webCamRef = React.useRef(null);

  const openWebCam = () => {
    setIsWebCamVisible(true);
  };

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
        setIsWebCamVisible(false);
        submit(file);
      } else {
        message.error(`No photo has been taken. Please retry.`);
      }
    });
  };

  return (
    <>
      <div>
        {!showPrediction && (
          <img className="spotifyFake" src={require('../../../assets/FaceGuardSpotify.png')} onClick={showLoginModal} />
        )}
      </div>
      <Modal
        title="FaceGuard Login"
        visible={isLoginModalVisisble}
        onOk={openWebCam}
        onCancel={handleCancel}
        okText="Login"
      >
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={openWebCam}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
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
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {isWebCamVisible && (
        <Modal
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
      )}
      {showPrediction && (
        <Card>
          <Spin spinning={predictionsLoading} tip="Who are you? Loading...">
            <Image style={{ maxHeight: 500, maxWidth: 500 }} src={img} />
            <Card type="inner" title="Name" style={{ marginTop: 16 }}>
              {predictionName}
            </Card>
            <Card type="inner" title="Probability" style={{ marginTop: 16 }}>
              {predictionProb}
            </Card>
          </Spin>
        </Card>
      )}
    </>
  );
}
