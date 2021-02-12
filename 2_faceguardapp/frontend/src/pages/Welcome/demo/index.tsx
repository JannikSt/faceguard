import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Upload,
  message,
  Card,
  Input,
  Carousel,
  Alert,
  Space,
  Image,
  Tooltip,
  Button,
  Tabs,
  Modal,
  Spin,
  Descriptions,
} from 'antd';
import { useSelector, useDispatch } from 'umi';
import {
  FrownOutlined,
  SmileOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import reqwest from 'reqwest';
import { ApiStates } from '@/models/welcome';
import WebCam from '@/components/Webcam';

export default function Start() {
  const { Meta } = Card;
  const { Dragger } = Upload;
  const { Search } = Input;
  const { TabPane } = Tabs;

  const carousel = useRef(null);
  const dispatch = useDispatch();

  const [name, setName] = useState<any>();
  const [predictionsLoading, setPredictionsLoading] = useState<any>(true);
  const [predictionName, setPredictionName] = useState<any>();
  const [predictionProb, setPredictionProb] = useState<any>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imgObject, setImageObject] = useState<any>();
  const [img, setImage] = useState<any>(); //Base64 of photo
  const [isWebCamVisible, setIsWebCamVisible] = useState(false);
  const [webCamLoading, setWebCamLoading] = useState(true);

  const Mode = useSelector((state: any) => state.selectMode.Mode);

  const selectMode = (input: ApiStates) => {
    dispatch({
      type: 'selectMode/setMode',
      payload: input,
    });
    next();
  };

  function getBase64(imgObject, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(imgObject);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg'; // || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }

    console.log('BEFORE', file);

    setImageObject(file);

    getBase64(file, (imageUrl: any) => {
      setImage(imageUrl);
    });

    if (Mode === ApiStates.TEST_MODEL) {
      submit(true, file);
    }
    next();
    return false;
  }

  // Dragger Props
  const props = {
    name: 'file',
    showUploadList: false,
    multiple: false,
    beforeUpload: beforeUpload,
  };

  const submit = (testing: Boolean, imgObject_: any) => {
    setSubmitLoading(true);

    const formData = new FormData();
    let urlHelper = 'url';

    if (ApiStates.UPLOAD_NEW_FOTO === Mode) {
      testing = false;
      imgObject_ = imgObject;
      console.log('UPLOAD_FOTO_CASE');
      if (imgObject_ && name) {
        (urlHelper =
          'https://app.faceguard.ml/api/v1/train'),
          formData.append('file', imgObject_!);
        formData.append('name', name!);
        console.log('THIS IS THE IMAGE', imgObject_);
      } else {
        message.error('Please enter a name.');
        setSubmitLoading(false);
        return;
      }
    }

    if (ApiStates.TEST_MODEL === Mode) {
      console.log(imgObject_);
      console.log('TEST_MODEL_CASE');
      if (imgObject_) {
        (urlHelper =
          'https://app.faceguard.ml/api/v1/predict'),
          formData.append('file', imgObject_!);
      } else {
        message.error('No image found for upload.');
        setSubmitLoading(false);
        return;
      }
    }

    console.log('ObjectImage', imgObject_);
    //console.log("formdata", formData);
    reqwest({
      url: urlHelper,
      method: 'post',
      processData: false,
      data: formData,
      success: (res) => {
        console.log('RES', res);
        setSubmitLoading(false);
        if (!testing) {
          next();
          message.success(`Submitted photo for ${name}.`);
        } else {
          message.success(`Submitted photo.`);
          setPredictionName(res.data.name);
          setPredictionProb(res.data.confidence);
          setPredictionsLoading(false);
        }
      },
      error: () => {
        setSubmitLoading(false);
        message.error('Upload failed.');
        if (ApiStates.TEST_MODEL === Mode) prev();
      },
    });
  };

  const next = () => {
    carousel.current.next();
  };

  const prev = () => {
    carousel.current.prev();
    setPredictionProb(undefined);
    setPredictionName(undefined);
  };

  const onChangeName = (e: any) => {
    setName(e.target.value);
    console.log(name);
  };

  const end = () => {
    location.reload();
    setPredictionProb(undefined);
    setPredictionName(undefined);
  };

  const correctFeedback = (correctFeedback: Boolean) => {
    correctFeedback
      ? message.info('Thank you for your Feedback. We are happy it worked nice!')
      : message.info("Thank you for your Feedback. We are sorry it didn't work as intented.");
  };

  // POST
  // One:    Send photo and receive name, save the name and display it
  // Second: Send photo and model to name

  // Webcam
  const webCamRef = React.useRef(null);

  const openWebCam = () => {
    setIsWebCamVisible(true);
  };

  const handleCancel = () => {
    setIsWebCamVisible(false);
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
      console.log(file);
      setImageObject(file);
      //const testing = true
      if (file) {
        setIsWebCamVisible(false);
        if (Mode === ApiStates.TEST_MODEL) submit(true, file);
        next();
      } else {
        message.error(`No photo has been taken. Please retry.`);
      }
    });
  };

  return (
    <PageContainer>
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
            </Button>
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
      <Carousel ref={carousel} effect="fade" dots={false}>
        <div>
          <Tabs>
            <TabPane tab="Home">
              <Card style={{ textAlign: 'center', height: '60vh' }}>
                <Card
                  style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                  }}
                  bordered={false}
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => {
                        selectMode(ApiStates.UPLOAD_NEW_FOTO);
                      }}
                    >
                      Add New Person
                    </Button>,
                    <Button
                      type="primary"
                      onClick={() => {
                        selectMode(ApiStates.TEST_MODEL);
                      }}
                    >
                      Find Existing Person
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Alert
                      message="You will be forwarded automatically!"
                      type="info"
                      showIcon
                      closable
                    />
                    <span>
                      Welcome to FaceGuard Demo. Please choose wether you want to add a new personen
                      to the model or test it for an existing person.
                    </span>
                  </Space>
                </Card>
              </Card>
            </TabPane>
          </Tabs>
        </div>
        <div>
          <Tabs>
            <TabPane tab={Mode}>
              <Card style={{ textAlign: 'center', height: '60vh' }}>
                <Card
                  style={{
                    maxWidth: '400px',
                    margin: '0 auto',
                  }}
                  bordered={false}
                  actions={[
                    <Button onClick={prev}>Back</Button>,
                    <Button type="primary" onClick={openWebCam}>
                      Open Webcam
                    </Button>,
                  ]}
                >
                  <Space direction="vertical">
                    <Alert
                      message="Upload a photo or take one! Please ensure your face is visible."
                      type="info"
                      showIcon
                      closable
                    />
                    <Dragger {...props}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click/drag file to this area to upload</p>
                      <p className="ant-upload-hint">Support for a single upload.</p>
                    </Dragger>
                  </Space>
                </Card>
              </Card>
            </TabPane>
          </Tabs>
        </div>
        <div>
          <Tabs>
            <TabPane tab={Mode}>
              <Card style={{ textAlign: 'center', height: '60vh' }}>
                <Card
                  style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                  }}
                  bordered={false}
                  cover={
                    <Tooltip title="Click to zoom">
                      <Image
                        alt="example"
                        src={img}
                        style={{
                          maxHeight: '500px',
                          maxWidth: '500px',
                          margin: '0 auto',
                        }}
                      />
                    </Tooltip>
                  }
                  actions={[
                    <Button onClick={prev}>Back</Button>,
                    <Button type="primary" onClick={end}>
                      End
                    </Button>,
                  ]}
                >
                  <Meta
                    style={{
                      textAlign: 'center',
                      maxWidth: '500px',
                      margin: '0 auto',
                    }}
                    title={
                      <>
                        {Mode === ApiStates.UPLOAD_NEW_FOTO && (
                          <Search
                            placeholder="Name"
                            allowClear
                            enterButton="Submit"
                            size="middle"
                            loading={submitLoading}
                            onSearch={submit}
                            onChange={onChangeName}
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            suffix={
                              <Tooltip title="Add a name so we know who that person is.">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                              </Tooltip>
                            }
                          />
                        )}
                        {Mode === ApiStates.TEST_MODEL && (
                          <>
                            <Spin spinning={predictionsLoading} tip="Who are you? Loading...">
                              <Descriptions
                                title="User Info"
                                style={{
                                  textAlign: 'center',
                                  margin: '0 auto',
                                }}
                              >
                                <Descriptions.Item label="Name">{predictionName}</Descriptions.Item>
                                <Descriptions.Item label="Probability">
                                  {predictionProb}%
                                </Descriptions.Item>
                              </Descriptions>
                              <Descriptions
                                title="Rate Prediction"
                                style={{
                                  textAlign: 'center',
                                  margin: '0 auto',
                                }}
                              >
                                <Descriptions.Item>
                                  <span
                                    style={{
                                      margin: '0 auto',
                                    }}
                                  >
                                    <Space>
                                      <Tooltip title="Was that a correct prediction?">
                                        <Tooltip title="Was that a correct prediction?">
                                          <Button
                                            onClick={() => {
                                              correctFeedback(true);
                                            }}
                                          >
                                            <SmileOutlined />
                                          </Button>
                                        </Tooltip>
                                        <Button
                                          onClick={() => {
                                            correctFeedback(true);
                                          }}
                                        >
                                          <FrownOutlined />
                                        </Button>
                                      </Tooltip>
                                    </Space>
                                  </span>
                                </Descriptions.Item>
                              </Descriptions>
                            </Spin>
                          </>
                        )}
                      </>
                    }
                  />
                </Card>
              </Card>
            </TabPane>
          </Tabs>
        </div>
      </Carousel>
    </PageContainer>
  );
}
