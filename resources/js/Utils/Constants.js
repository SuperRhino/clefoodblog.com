var keyMirror = require('keyMirror');

const HOST_NAME = "clefoodblog.com";
const ENV = (window.location.hostname === HOST_NAME) ? 'production' : 'dev';

var isProd     = true,
    apiVersion = 'v1',
    apiHost    = 'http://'+HOST_NAME+'/api',
    siteRoot   = 'http://'+HOST_NAME;

switch (ENV) {
    case 'dev':
        isProd   = false;
        apiHost  = 'http://dev.'+HOST_NAME+'/api';
        siteRoot = 'http://dev.'+HOST_NAME;
        break;
}

export var Config = {
  ENV: ENV,
  api_root: apiHost+'/',
  site_root: siteRoot+'/',

  Storage: keyMirror({
    ACCESS_TOKEN: null,
  }),
};