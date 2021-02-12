/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React from 'react';
import { Link, useIntl, connect, Dispatch, Redirect } from 'umi';
//import RightContent from '@/components/GuestHeader/RightContent';
import { ConnectState } from '@/models/connect';
//import { JwtInterface } from '@/utils/authority';
import { CurrentUser } from '@/models/user';
import styles from './Layout.less';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  //currentJsonWebToken: JwtInterface;
  currentUser?: CurrentUser;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

const defaultFooterDom = (
  <DefaultFooter
    copyright="2020 FaceGuard | Made with ❤ in Munich"
    links={[
      {
        key: 'Imprint',
        title: 'Imprint',
        href: '',
      },
      {
        key: 'TOC',
        title: 'Terms and Conditions',
        href: '',
      },
    ]}
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    children,
    settings, //currentJsonWebToken,
    currentUser,
  } = props;

  /**
   * constructor
   */
  const { formatMessage } = useIntl();

  // if we are logged in, redirect to dashboard
  if (
    currentUser &&
    currentUser.userid //&& currentJsonWebToken
  ) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <ProLayout
      logo="/images/icon.png"
      formatMessage={formatMessage}
      menuHeaderRender={(logoDom) => <Link to="/">{logoDom}</Link>}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({ id: 'menu.home' }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => defaultFooterDom}
      {...props}
      {...settings}
      layout="topmenu"
      className={styles.layout}
      //rightContentRender={() => <RightContent />}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({ settings, user }: ConnectState) => ({
  settings,
  //currentJsonWebToken: user.currentJsonWebToken,
  currentUser: user.currentUser,
}))(BasicLayout);
