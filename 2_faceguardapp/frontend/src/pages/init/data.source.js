export const Banner00DataSource = {
  wrapper: { className: 'banner0' },
  textWrapper: { className: 'banner0-text-wrapper' },
  title: {
    className: 'banner0-title',
    children: '/images/logo.png',
    isImage: true,
  },
  content: {
    className: 'banner0-content',
    children: 'The best approach for your 2FA!',
  },
  button: { className: 'banner0-button', children: 'Login' },
};
export const PaceGuardDataSource = {
  wrapper: { className: 'home-page-wrapper content1-wrapper' },
  OverPack: { className: 'home-page content1', playScale: 0.3 },
  imgWrapper: { className: 'content1-img', md: 10, xs: 24 },
  img: {
    children: '/images/dashboard.png',
    title: 'PaceGuard Dashboard',
  },
  textWrapper: { className: 'content1-text', md: 14, xs: 24 },
  title: { className: 'content1-title', children: 'Paceguard in a nutshell' },
  content: {
    className: 'content1-content',
    children:
      'Are you sure that all of your APIs behave the way they are supposed to? Are you sure that all your APIs work properly? Are you sure that no user is exploiting a bug in your application? Error reporting and unit & integration tests are great and essential, but too often outside or inside forces cause your service to be disrupted or abused. In this case, your DevOps team only notices this once a user request comes in, which is essentially too late. What if you could monitor your app and it’s vital parameters similar to monitoring a patient in a hospital? With the same accuracy as a medical ECG machine and the same alerting when something unexpected happens? PaceGuard is a SaaS solution similar to an ECG that is monitoring your app and services health around the clock and takes action if necessary. Within minutes you can integrate PaceGuard as a middleware plugin into your app as it comes with prepared modules for the most common development stacks. Various events and parameters are automatically streamed to the PaceGuard servers and analyzed in near real-time.',
  },
};
export const PatrolDataSource = {
  wrapper: { className: 'home-page-wrapper content1-wrapper' },
  OverPack: { className: 'home-page content1', playScale: 0.3 },
  imgWrapper: { className: 'content1-img', md: 10, xs: 24 },
  img: {
    children: '/images/patrol.png',
    title: 'PaceGuard Patrol',
  },
  textWrapper: { className: 'content1-text', md: 14, xs: 24 },
  title: { className: 'content1-title', children: 'Paceguard Patrol' },
  content: {
    className: 'content1-content',
    children:
      'Let PaceGuard help you keep your app safe and prevent users from abusing your service! PaceGuard Patrol helps you set usage-policies on functions, events, and routes. PG Patrol detects threshold and policy breaches as well as abnormal behavior patterns using state-of-the-art AI technologies. This could be key to prevent your competitors from exploiting your API though e.g. automated API scraping to spy on essential business decisions. For instance, if your company provides mobility services such as Lime does with scooters, your devices location is accessible using the API, you could prevent your competitors from gaining valuable insights into your business. Another example would be a user of a web-service pressing the submit button on a website multiple times due to a UI issue not confirming the click because of  an unnoticed bug which can cause preventable costs. Once a policy breach is detected, Patrol can take action, which may include notifying an admin, triggering a callback in your application’s code or even blocking the user’s requests for a certain time.',
  },
};
export const WatchDataSource = {
  wrapper: { className: 'home-page-wrapper content1-wrapper' },
  OverPack: { className: 'home-page content1', playScale: 0.3 },
  imgWrapper: { className: 'content1-img', md: 10, xs: 24 },
  img: {
    children: '/images/watch_insights.png',
    title: 'PaceGuard Watch',
  },
  textWrapper: { className: 'content1-text', md: 14, xs: 24 },
  title: { className: 'content1-title', children: 'Paceguard Watch' },
  content: {
    className: 'content1-content',
    children:
      'The core of our solution is PaceGuard Watch. It provides an interactive real-time dashboard that keeps you up to date about the health and heartbeat of your app. If parts of your app are dysfunctional and anomalies are detected, alerts are displayed to the user via the dashboard. In addition, the system can automatically trigger your favorite webhooks (such as Slack or Twilio) to keep your DevOps team informed (see pricing plans for further details). ',
  },
};
