module.exports = {
  jsBuildDirectory: './public/build/js/',
  cssBuildDirectory: './public/build/css/',
  mainJsFile: './resources/js/main.js',
  appCssFiles: './resources/less/*.less',
  prodFiles: './public/build/@(css|js)/*-*.*',
  commonCss: [
    "./bower_components/bootstrap/dist/css/bootstrap.css",
    "./bower_components/bootstrap/dist/css/bootstrap-theme.css",
    "./node_modules/react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css",
    "./node_modules/react-medium-editor/node_modules/medium-editor/dist/css/medium-editor.css",
    "./node_modules/react-medium-editor/node_modules/medium-editor/dist/css/themes/default.css",
  ],
};
