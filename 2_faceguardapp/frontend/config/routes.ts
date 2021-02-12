export default [
  {
    path: '/',
    component: '../layouts/GuestLayout',
    routes: [
      {
        path: '/init',
        //component: '../layouts/BlankLayout',
        routes: [
          {
            name: 'init',
            path: '/init',
            component: './init',
          },
        ],
      },
      {
        path: '/register',
        //component: '../layouts/BlankLayout',
        routes: [
          {
            name: 'register',
            path: '/register',
            component: './register',
          },
        ],
      },
      {
        path: '/spotify',
        //component: '../layouts/BlankLayout',
        routes: [
          {
            name: 'spotify',
            path: '/spotify',
            component: './spotify',
          },
        ],
      },
      {
        path: '/',
        //component: '../layouts/BlankLayout',
        routes: [
          {
    
            path: '/',
            redirect: '/init',
          },
        ],
      },


      {/*
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/welcome/start',
              },
                            {
                path: '/welcome',
                redirect: '/welcome/start',
              },
              {
                name: 'welcome',
                icon: 'smile',
                path: '/welcome',
                routes: [
                  {
                      name: 'Start',
                      icon: 'smile',
                      path: '/welcome/start',
                      component: './Welcome/start',
                    },
                ],
              },
              {
              name: 'account',
              icon: 'user',
              path: '/account',
              routes: [
                {
                  path: '/',
                  redirect: '/account/settings',
                },
                {
                  name: 'settings',
                  icon: 'smile',
                  path: '/account/settings',
                  component: './account/settings',
                },
              ],},
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      */},
    ],
  },
  {
    component: './404',
  },
];
