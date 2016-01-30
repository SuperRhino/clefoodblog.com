import React from 'react';
import moment from 'moment';
import DateTimeInput from 'react-bootstrap-datetimepicker';
import ApiRequest from '../Api/ApiRequest';
import CurrentUser from '../Stores/CurrentUser';

export default class AddPageForm extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.postTimestamp = null;

    this.state = {
      authorized: true,
      user: this.props.user,
    };

    this._onSubmitPage = this._onSubmitPage.bind(this);
    this._onPostDateChange = this._onPostDateChange.bind(this);
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

  render() {
    if (! this.state.authorized) return <h4>Must be logged in :(</h4>;

    let placeholderCopy = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi iaculis est lectus, posuere scelerisque massa rhoncus in. Vestibulum facilisis purus non velit porttitor, non imperdiet erat condimentum.";

    // add .has-success or .has-error
    // .glyphicon-ok or .glyphicon-remove
    return (
      <form className="" role="form" onSubmit={this._onSubmitPage}>
        <div className="row">
          <div className="col-xs-12">
            <h1>Add New Page</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-4">
            <p className="lead"><em>Add meta data:</em></p>
          </div>
          <div className="col-xs-8">
            <p className="lead"><em>Write article:</em></p>
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
              <input ref="pageUri" className="form-control input-lg" type="text" placeholder="page-url" />
            </div>
            <div className="form-group">
              <select ref="pageCategory" className="form-control input-lg">
                <option value="">— Choose Category —</option>
                <option>Reviews</option>
                <option>Recipes</option>
                <option>How To's</option>
                <option>Friday Food Fight</option>
                <option>Where To Find...</option>
              </select>
            </div>
            <div className="form-group">
              <div style={styles.previewImage}>Drag Preview Image Here</div>
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
                <input ref="pageTitle" className="form-control input-lg" type="text" placeholder="Headline" />
            </div>
            <div className="form-group">
              <textarea ref="pageArticle" className="form-control input-lg" rows="10" placeholder={placeholderCopy}></textarea>
            </div>
            <button type="submit" className="btn btn-lg btn-info" style={styles.button}>
              <span className="glyphicon glyphicon-plus-sign"></span>
              {' Add Page'}
            </button>
          </div>
        </div>
      </form>
    );
  }

  _onPostDateChange(datetime) {
    this.postTimestamp = datetime;
  }

  _getPostDateFormat() {
    return moment.unix(this.postTimestamp / 1000).format("YYYY-MM-DD HH:mm:00");
  }

  _getPageData() {
    return {
      title: this.refs.pageTitle.value,
      article: this.refs.pageArticle.value,
      uri: this.refs.pageUri.value,
      category: this.refs.pageCategory.value,
      meta_title: this.refs.metaTitle.value,
      meta_description: this.refs.metaDescription.value,
      meta_keywords: this.refs.metaKeywords.value,
      post_date: this.postTimestamp ? this._getPostDateFormat() : null,
    };
  }

  _onSubmitPage(e) {
    e.preventDefault();
    var data = this._getPageData();
    console.log('_onSubmitPage', data);

    ApiRequest.post('/page')
      .data(data)
      .send(page => console.log('page:', page));

  }

  _onUserChange(user) {
    this.setState({authorized: !! user.id});
  }
}


var styles = {
  button: {
    width: '100%',
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
};