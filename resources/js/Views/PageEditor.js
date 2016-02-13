import React from 'react';
import moment from 'moment';
import Editor from 'react-medium-editor';
import DateTimeInput from 'react-bootstrap-datetimepicker';

import Utils from '../Utils/Utils';
import ApiRequest from '../Api/ApiRequest';
import CurrentUser from '../Stores/CurrentUser';
import SRDropzone from '../Components/SRDropzone';

export default class PageEditor extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.postTimestamp = null;
    this.hasCustomUri = false;

    this.state = {
      authorized: true,
      publishing: false,
      processing: false,
      user: this.props.user,
      article: "",
      uri: "",
      pageId: null,
    };

    this._onSubmitPage = this._onSubmitPage.bind(this);
    this._onPublish = this._onPublish.bind(this);
    this._onPostDateChange = this._onPostDateChange.bind(this);
    this._onUpdatePageUri = this._onUpdatePageUri.bind(this);
    this._onChangeUri = this._onChangeUri.bind(this);
    this._onBlurUri = this._onBlurUri.bind(this);
    this._onArticleChange = this._onArticleChange.bind(this);
    this._onUserChange = this._onUserChange.bind(this);
  }

  componentWillMount() {
    this.stopUserSubscribe = CurrentUser.listen(this._onUserChange);

    let user = CurrentUser.get();
    this.setState({
      authorized: !! user.id,
      user,
    });
  }

  componentWillUnmount() {
    this.stopUserSubscribe();
  }

  renderProgressBar() {
    let barClassName = this.state.publishing ? 'progress-bar-success' : 'progress-bar-info';
    return (
      <div className="progress" style={{height: "auto"}}>
        <div className={"progress-bar "+barClassName+" progress-bar-striped active"} role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={styles.progressBar}>
          {this.state.publishing ? 'Publishing...' : 'Saving...'}
        </div>
      </div>
    );
  }

  renderSubmitButton() {
    if (this.state.processing) {
      return this.renderProgressBar();
    }

    return (
      <div>
        <button type="submit" className="btn btn-lg btn-info" style={styles.button}>
          <span className="glyphicon glyphicon-plus-sign"></span>
          {' Save Page'}
        </button>
        <button type="button" className="btn btn-lg btn-success" style={styles.button} onClick={this._onPublish}>
          <span className="glyphicon glyphicon-ok-sign"></span>
          {' Publish Page'}
        </button>
      </div>
    );
  }

  render() {
    if (! this.state.authorized) return <h4>Must be logged in :(</h4>;

    let imageButton = {
      name: 'image',
      action: 'image',
      aria: 'image',
      tagNames: ['img'],
      contentDefault: '<i class="glyphicon glyphicon-picture"></i>',
      contentFA: '<i class="fa fa-picture-o"></i>'
    };
    let editorOptions = {
      placeholder: {text: "Article body..."},
      toolbar: {
        buttons: ['bold', 'italic', 'anchor', 'h2', 'h3', 'quote', 'unorderedlist', imageButton],
      },
    };

    let categories = ["Reviews", "Recipes", "How To's", "Friday Food Fight", "Where To Find..."];

    // add .has-success or .has-error
    // .glyphicon-ok or .glyphicon-remove
    return (
      <form ref="addNewPage" className="" role="form" onSubmit={e => this._onSubmitPage(e)}>
        <div className="row">
          <div className="col-xs-12">
            <h1>Page Editor</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-4">
            <p className="lead"><em>Data about data:</em></p>
          </div>
          <div className="col-xs-8">
            <p className="lead"><em>Spit your knowledge game:</em></p>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-4">
            <div className="form-group">
              <DateTimeInput
                size={'lg'}
                defaultText={''}
                inputProps={{placeholder: "Article Date/Time"}}
                format={'x'}
                inputFormat={'YYYY-MM-DD hh:mm A'}
                onChange={this._onPostDateChange} />
            </div>
            <div className="form-group">
              <input ref="pageUri"
                    type="text"
                    className="form-control input-lg"
                    placeholder="Custom-Page-Url"
                    value={this.state.uri}
                    onChange={this._onChangeUri}
                    onBlur={this._onBlurUri} />
            </div>
            <div className="form-group">
              <select ref="pageCategory" className="form-control input-lg">
                <option value="">— Choose Category —</option>
                {categories.map((category, index) => {
                  return (<option key={'category-'+category}>{category}</option>);
                })}
              </select>
            </div>
            <div className="form-group">
              <input ref="previewImage" className="form-control input-lg" type="text" placeholder="Preview Image URL" />
            </div>
            <div className="form-group">
              <input ref="metaTitle" className="form-control input-lg" type="text" placeholder="Enter meta title" />
            </div>
            <div className="form-group">
              <textarea ref="metaDescription" className="form-control input-lg" rows="2" placeholder="Enter meta description"></textarea>
            </div>
            <div className="form-group">
              <input ref="metaKeywords" className="form-control input-lg" type="text" placeholder="Enter meta keywords" />
            </div>
          </div>
          <div className="col-xs-8">
            <div className="form-group">
                <input ref="pageTitle" className="form-control input-lg" type="text" placeholder="Headline"
                  onChange={this._onUpdatePageUri} />
            </div>
            <div className="form-group">
              <Editor
                style={styles.editor}
                className="form-control input-lg"
                text={this.state.article}
                onChange={this._onArticleChange}
                options={editorOptions} />
            </div>
            {this.renderSubmitButton()}
            <input ref="pageId" type="hidden" name="pageId" value={this.state.pageId} />
          </div>
        </div>
        <div className="row" style={styles.uploaderRow}>
          <div className="col-xs-12">
            <SRDropzone
              style={styles.previewImage}
              activeStyle={styles.dragActive}
              multiple={false} />
          </div>
        </div>
      </form>
    );
  }

  _onPostDateChange(datetime) {
    this.postTimestamp = datetime;
    this._onUpdatePageUri();
  }

  _getPostDateFormat(format = "YYYY-MM-DD HH:mm:00") {
    let dateFormat = moment.unix(this.postTimestamp / 1000).format(format);
    if (dateFormat == 'Invalid date') {
      return "";
    }
    return dateFormat;
  }

  _getPageData(publish = false) {
    return {
      title: this.refs.pageTitle.value,
      article: this.state.article, // this.refs.pageArticle.value,
      uri: this.state.uri || this.refs.pageUri.value,
      category: this.refs.pageCategory.value,
      preview_image: this.refs.previewImage.value,
      meta_title: this.refs.metaTitle.value,
      meta_description: this.refs.metaDescription.value,
      meta_keywords: this.refs.metaKeywords.value,
      post_date: this.postTimestamp ? this._getPostDateFormat() : null,
      publish: publish,
    };
  }

  _onPublish(e) {
    this._onSubmitPage(e, true);
  }

  _onSubmitPage(e, publish = false) {
    e.preventDefault();
    if (this.state.processing) return;

    let endpoint = this.state.pageId ? '/page/' + this.state.pageId : '/page';

    this.setState({processing: true, publishing: publish});
    ApiRequest.post(endpoint)
      .data(this._getPageData(publish))
      .send(res => {
        let page = res.data,
            message = publish ? 'Page published!' : 'Page saved!';
        Utils.showSuccess(message);
        this.setState({
          processing: false,
          pageId: page.id,
        });
        // this._clearForm();
      });
  }

  _clearForm() {
    this.refs.addNewPage.reset();
    this.postTimestamp = null;
    this.hasCustomUri = false;
    this.setState({
      processing: false,
      article: "",
      uri: "",
    });
  }

  _getUriFromTitle() {
    let headline = this.refs.pageTitle.value || 'untitled',
        postDate = this.postTimestamp ? this._getPostDateFormat("-YYYY-MM-DD") : "";
    return Utils.cleanForUrl(headline+postDate);
  }

  _onBlurUri(e) {
    if (! e.target.value) {
      this.hasCustomUri = false;
      this._onUpdatePageUri();
    }
  }

  _onChangeUri(e) {
    this.hasCustomUri = true;

    this.setState({uri: this.refs.pageUri.value});
    return true;
  }

  _onUpdatePageUri() {
    if (this.hasCustomUri) return;

    this.setState({uri: this._getUriFromTitle()});
  }

  _onArticleChange(article, medium) {
    this.setState({article});
  }

  _onUserChange(user) {
    this.setState({authorized: !! user.id});
  }
}


var styles = {
  button: {
    width: '48%',
    margin: '0 1%',
  },
  editor: {
    height: "auto",
    minHeight: "20em",
  },
  previewImage: {
    color: "rgb(150,150,150)",
    borderWidth: 2,
    borderColor: "rgba(150,150,150,.8)",
    borderStyle: "dashed",
    fontWeight: "bold",
    textAlign: "center",
    padding: "40px 0",
  },
  dragActive: {
    borderColor: 'rgb(120,120,120)',
  },
  progressBar: {
    fontSize: "18px",
    padding: "10px 0",
    width: "100%",
  },
  uploaderRow: {
    marginTop: "15px",
  },
};