import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Cascader,
  Checkbox,
  Form,
  Input,
  message,
  PageHeader,
  Result,
  Select,
  Space,
  Upload,
  Image,
  Modal,
} from 'antd';
//import ReCAPTCHA from 'react-google-recaptcha';
import { history } from '@@/core/history';
import { CameraOutlined, UploadOutlined } from '@ant-design/icons';
//import { createUser } from '@/services/user';
//import { accountLogin, LoginParamsType } from '@/services/login';
//import { addOrganizationWithJwt, bindApplication } from '@/services/userApp';
import reqwest from 'reqwest';
import { useDispatch } from 'umi';
import request from '@/utils/request';
import WebCam from '@/components/Webcam';

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

const RegistrationFormFoto: React.FC<RegistrationFormProps> = (props: any) => {
  const [form] = Form.useForm();
  const [done, setDone] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [img, setImage] = useState<any>('test'); //Base64 of photo
  const [uploadedFoto, setUploadedFoto] = useState(false);
  const [imgObject, setImageObject] = useState<any>();
  const [isWebCamVisible, setIsWebCamVisible] = useState(false);
  const [webCamLoading, setWebCamLoading] = useState(true);
  const { next, prev, userid } = props;

  /*
  useEffect(() => {
    // GET FOTO
    setImage('TEST');
  });
  */

  function getBase64(imgObject, callback) {
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
      setUploadedFoto(true);
    }
    //console.log(img);
    return isLt2M && isJpgOrPng;
  }

  const onFinish = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', imgObject);
    formData.append('userid', userid);

    //console.log('EMAIL', email);

    reqwest({
      url: '/api/v1/train',
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        message.success(`Welcome to FaceGuard!`);
        history.push('/');
        setLoading(false);
        //history.push
      },
      error: (err: any) => {
        message.error(`Someting went wrong with the foto upload: ${err}.`);
        setLoading(false);
      },
    });
  };

  const AvatarView = () => (
    <>
      <div style={{ float: 'left' }}>
        <Image
          style={{ width: 200, height: 'auto' }}
          src={img}
          alt="avatar"
          fallback="data:image/png;base64,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"
        />
      </div>
      <div style={{ float: 'right' }}>
        <Upload showUploadList={false} beforeUpload={beforeUpload}>
          <Button style={{ width: 200, position: 'absolute', bottom: 50, right: 0 }} shape="round">
            <UploadOutlined />
            Upload
          </Button>
        </Upload>
        <Button
          onClick={() => setIsWebCamVisible(true)}
          style={{ width: 200, position: 'absolute', bottom: 0, right: 0 }}
          shape="round"
        >
          <CameraOutlined />
          Webcam
        </Button>
      </div>
    </>
  );

  const handleCancel = () => {
    //setIsLoginModalVisisble(false);
    setIsWebCamVisible(false);
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
        setIsWebCamVisible(false);
        setUploadedFoto(true);
        setImageObject(file);
      } else {
        message.error(`No photo has been taken. Please retry.`);
      }
    });
  };

  return (
    <div>
      <PageHeader title="Sign up for FaceGuard" />
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
            loading={loading}
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
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish} // onFinish
        scrollToFirstError
      >
        <Form.Item
          name="foto"
          required
          rules={[
            {
              validator: (_, value) =>
                uploadedFoto
                  ? Promise.resolve()
                  : Promise.reject(new Error('Should upload a foto!')),
            },
          ]}
        >
          <AvatarView />
        </Form.Item>
        <Form.Item {...tailFormItemLayout} style={{ float: 'right' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
      <div style={{ margin: '0 auto', justifyContent: 'center', float: 'right' }}>
        <Space>
          <Button onClick={prev}>Previous</Button>
        </Space>
      </div>
    </div>
  );
};

/*
 <ReCAPTCHA
        ref={recaptchaRef}
        onChange={onCaptchaChange}
        size="invisible"
        sitekey="6LcDnrAZAAAAAOlg4ccr9OnVlWZg6FjXQaVm5LK7"
      />
*/

export default RegistrationFormFoto;
