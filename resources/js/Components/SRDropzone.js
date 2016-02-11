import React from 'react';
import Dropzone from 'dropzone';
import Utils from '../Utils/Utils';
import ApiUtils from '../Api/ApiUtils';
import AccessToken from '../Api/AccessToken';

export default class SRDropzone extends React.Component {
  static propTypes = {
    style: React.PropTypes.object,
    activeStyle: React.PropTypes.object,
    multiple: React.PropTypes.bool,
  };
  static defaultProps = {
    style: {},
    activeStyle: {},
    multiple: true,
  };

  constructor(props) {
    super(props);

    this.dropzone = null;

    this.state = {};
  }

  componentDidMount() {
    AccessToken.get()
      .then(token => {
        let dzOptions = {
          url: ApiUtils.buildUrl('/upload-file?token='+token),
          dictDefaultMessage: "Dragon Drop Image Area",
          init: function() {
            this.on("success", (file, response) => {
              console.log(file, response);
            });
          },
        };
        this.dropzone = new Dropzone(this.refs.dropzone, dzOptions);
      });
  }

  render() {
    return (
      <div ref="dropzone" style={this.props.style} className="dropzone">
        {this.props.children}
      </div>
    );
  }
}