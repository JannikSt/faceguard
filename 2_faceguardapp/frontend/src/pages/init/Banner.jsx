import React from 'react';
import { Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import { isImg } from '../../utils/landingUtils';

export default function Banner(props) {
  const { ...currentProps } = props;
  const { dataSource } = currentProps;
  delete currentProps.dataSource;
  delete currentProps.isMobile;

  function login() {
    props.login();
  }
  function getStarted() {
    props.getStarted();
  }

  return (
    <div {...currentProps} {...dataSource.wrapper}>
      <QueueAnim key="QueueAnim" type={['bottom', 'top']} delay={200} {...dataSource.textWrapper}>
        <div key="title" {...dataSource.title}>
          {(typeof dataSource.title.children === 'string' &&
            dataSource.title.children.match(isImg)) ||
          dataSource.title.isImage ? (
            <img src={dataSource.title.children} width="100%" alt="img" />
          ) : (
            dataSource.title.children
          )}
        </div>
        <div key="content" {...dataSource.content}>
          {dataSource.content.children}
        </div>
        <Space>
          <Button
            ghost
            key="button"
            {...dataSource.button}
            onClick={() => {
              login();
            }}
          >
            {dataSource.button.children}
          </Button>
          <Button
            ghost
            key="button"
            {...dataSource.button}
            onClick={() => {
              getStarted();
            }}
          >
            Start now!
          </Button>
        </Space>
      </QueueAnim>
      <TweenOne
        animation={{
          y: '-=20',
          yoyo: true,
          repeat: -1,
          duration: 1000,
        }}
        className="banner0-icon"
        key="icon"
      >
        <DownOutlined
          onClick={() => {
            //scrollToInfos();
          }}
        />
      </TweenOne>
    </div>
  );
}
