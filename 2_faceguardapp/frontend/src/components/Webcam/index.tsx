import React from 'react';
import Webcam from 'react-webcam';
import { Spin } from 'antd';

export default function WebCam(props: any) {
  const { webCamRef, webCamLoading, setWebCamLoading } = props;

  //const [webCamLoading, setWebCamLoading] = useState(true);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  };

  /*
    const capture = () => {
    const image = webCamRef.current.getScreenshot({
      width: 1920,
      height: 1080,
    });
    
  */

  return (
    <>
      <Spin spinning={webCamLoading} tip="Loading webcam...">
        <Webcam
          audio={false}
          height={props.height}
          ref={webCamRef}
          screenshotFormat="image/jpeg"
          width={props.width}
          videoConstraints={videoConstraints}
          onUserMedia={() => {
            setWebCamLoading(false);
          }}
        />
      </Spin>
    </>
  );
}
