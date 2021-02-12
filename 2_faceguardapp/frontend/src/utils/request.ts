/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
  200: 'The server successfully returned the requested data. ',
  201: 'Create or modify data was successful. ',
  202: 'A request has entered the background queue (asynchronous task). ',
  204: 'Delete data successfully. ',
  400: 'There was an error in the request sent, the server did not create or modify data. ',
  401: 'The user does not have permission (token, username, password is wrong). ',
  403: 'The user is authorized, but access is prohibited. ',
  404: 'The request sent was for a non-existent record, and the server did not perform an operation. ',
  406: 'The requested format is not available. ',
  410: 'The requested resource is permanently deleted and will no longer be obtained. ',
  422: 'When creating an object, a validation error occurred. ',
  500: 'An error occurred on the server, please check the server. ',
  502: 'Gateway error. ',
  503: 'Service is unavailable, the server is temporarily overloaded or maintained. ',
  504: 'The gateway timed out. ',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: 'Your network is down, cannot connect to the server',
      message: 'Connection Issue',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

export default request;
