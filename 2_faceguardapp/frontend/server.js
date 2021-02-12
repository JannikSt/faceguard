/** Server implementation for the react next.js app
 *
 * Source: https://github.com/zeit/next.js/tree/canary/examples/custom-server-express
 *
 * Author: Jannik Straube
 *
 */

//To parse env variables
require('dotenv').config();
const express = require('express');
const path = require('path');

const port = 8080;
const dev = !(process.env.NODE_ENV && process.env.NODE_ENV.includes('production'));

const server = express();
server.use(express.static(path.join(__dirname, 'dist')));
server.get('/health', (req, res) => {
  return res.json({status: 'ok'});
})
server.all('*', (req, res) => {
  /*
   * We have to force ssl as it is currently not supported
   * in GKE Ingress: https://issuetracker.google.com/issues/35904733
   *
   * Snippet source: https://medium.com/@steve.mu.dev/force-https-request-on-all-requests-in-node-js-b44a485c087c
   * */

  if (
    process.env.NODE_ENV &&
    process.env.NODE_ENV.includes('production') &&
    req.get('X-Forwarded-Proto') === 'http'
  ) {
    let secUrl = 'https://' + req.get('Host') + req.url;
    console.log('Insecure request: ' + req.get('Host') + req.url + '. Redirecting to: ' + secUrl);
    return res.redirect(secUrl);
  } else {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

server.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
