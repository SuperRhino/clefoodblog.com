import React from 'react';
import ReactDOM from 'react-dom';
import path from 'path';
import Utils from '../Utils/Utils';
import PageEditor from '../Views/PageEditor';
import PageInventory from '../Views/PageInventory';

export default class Routes {

  static homeRoute = 'home';

  static current(pathname) {
    var basename = path.basename(pathname) || Routes.homeRoute;
    var camelName = basename.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    if (typeof Routes[camelName] === 'function') {
      Routes[camelName]();
    }
  }

  //----------------------------
  // Custom Routes:
  //----------------------------

  static home() {
    console.log('Home route');
  }

  //----------------------------
  // Admin Routes:
  //----------------------------

  static pageEditor() {
    ReactDOM.render(
      <PageEditor />,
      document.getElementById('PageEditor')
    );
  }

  static pageInventory() {
    ReactDOM.render(
      <PageInventory />,
      document.getElementById('PageInventory')
    );
  }

}
