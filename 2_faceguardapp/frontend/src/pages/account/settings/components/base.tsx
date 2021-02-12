import { UploadOutlined, CameraOutlined } from '@ant-design/icons';
import { Button, Input, Select, Upload, Form, message, Image } from 'antd';
import { connect, FormattedMessage, formatMessage, useDispatch } from 'umi';
import React, { useEffect, useState, useRef, Component } from 'react';
import { CurrentUser } from '../data';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';
import reqwest from 'reqwest';
import { changeNameUser } from '../../../../../mock/user';

interface BaseViewProps {
  currentUser?: CurrentUser;
}

function BaseView(props: any) {
  const { currentUser } = props;
  const [img, setImage] = useState<any>('test'); //Base64 of photo
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imgObject, setImageObject] = useState<any>();

  const dispatch = useDispatch();

  /*
  useEffect(() => {
    // GET FOTO
    setImage('TEST');
  });
  */
  const handleUpload = (username: String) => {
    setSubmitLoading(true);
    console.log(imgObject);
    const formData = new FormData();
    formData.append('file', imgObject);
    formData.append('name', username);

    // TODO: Move to success in reqwest

    changeNameUser(username);
    console.log('USERNAME', username);

    dispatch({
      type: 'user/fetchCurrent',
      // payload: 'next',
    });

    reqwest({
      url: '/api/v1/train',
      method: 'post',
      processData: false,
      data: formData,
      success: (res: any) => {
        setSubmitLoading(false);
        message.success(`Submitted information.`);
      },
      error: (err) => {
        setSubmitLoading(false);
        message.error(`Someting went wrong: ${err}.`);
      },
    });
  };

  const { Option } = Select;

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

    if (isLt2M && isJpgOrPng) {
      setImageObject(file);
      getBase64(file, (imageUrl: any) => {
        setImage(imageUrl);
      });
    }
    console.log(img);
    return isLt2M && isJpgOrPng;
  }

  const AvatarView = () => (
    <>
      <div className={styles.avatar}>
        <Image
          src={img}
          alt="avatar"
          fallback="data:image/png;base64,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"
        />
      </div>
      <Upload showUploadList={false} beforeUpload={beforeUpload}>
        <div className={styles.button_view}>
          <Button block>
            <UploadOutlined />
            Upload
          </Button>
        </div>
      </Upload>
      <div className={styles.button_view} style={{ paddingTop: '10px' }}>
        <Button block>
          <CameraOutlined />
          Webcam
        </Button>
      </div>
    </>
  );
  interface SelectItem {
    label: string;
    key: string;
  }

  const validatorGeographic = (
    _: any,
    value: {
      province: SelectItem;
      city: SelectItem;
    },
    callback: (message?: string) => void,
  ) => {
    const { province, city } = value;
    if (!province.key) {
      callback('Please input your province!');
    }
    if (!city.key) {
      callback('Please input your city!');
    }
    callback();
  };

  const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
    const values = value.split('-');
    if (!values[0]) {
      callback('Please input your area code!');
    }
    if (!values[1]) {
      callback('Please input your phone number!');
    }
    callback();
  };

  let view: HTMLDivElement | undefined = undefined;

  const getAvatarURL = () => {
    const { currentUser } = props;
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      //TODO CHANGE TO FOTO OF PERSON
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };

  const getViewDom = (ref: HTMLDivElement) => {
    view = ref;
  };

  const handleFinish = (value: any) => {
    //message.success(formatMessage({ id: 'accountandsettings.basic.update.success' }));
    //console.log(value.name);

    // Upload of Foto
    handleUpload(value.name);
  };

  // OLD SUBMIT BUTTON
  /*
              <Button htmlType="submit" type="primary">
              <FormattedMessage
                id="accountandsettings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
  */

  return (
    <div className={styles.baseView} ref={getViewDom}>
      <div className={styles.left}>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={currentUser}
          hideRequiredMark
        >
          <Form.Item
            name="email"
            label="E-Mail"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'accountandsettings.basic.email-message' }, {}),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'accountandsettings.basic.nickname-message' }, {}),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="country"
            label={formatMessage({ id: 'accountandsettings.basic.country' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'accountandsettings.basic.country-message' }, {}),
              },
            ]}
          >
            <Select style={{ maxWidth: 220 }}>
              <Option value="China">中国</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="geographic"
            label={formatMessage({ id: 'accountandsettings.basic.geographic' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'accountandsettings.basic.geographic-message' }, {}),
              },
              {
                validator: validatorGeographic,
              },
            ]}
          >
            <GeographicView />
          </Form.Item>
          <Form.Item
            name="address"
            label={formatMessage({ id: 'accountandsettings.basic.address' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'accountandsettings.basic.address-message' }, {}),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label={formatMessage({ id: 'accountandsettings.basic.phone' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'accountandsettings.basic.phone-message' }, {}),
              },
              { validator: validatorPhone },
            ]}
          >
            <PhoneView />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'center' }}>
              <Button shape="round" type="primary" loading={submitLoading} htmlType="submit">
                {submitLoading ? 'Updating' : 'Update Information'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={getAvatarURL()} />
      </div>
    </div>
  );
}

export default connect(
  ({ accountAndsettings }: { accountAndsettings: { currentUser: CurrentUser } }) => ({
    currentUser: accountAndsettings.currentUser,
  }),
)(BaseView);
