import React from 'react';
import CurrentUser from '../Stores/CurrentUser';

export default class AddPageForm extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      authorized: true,
      user: this.props.user,
    };

    this._onSubmitEvent = this._onSubmitEvent.bind(this);
    this._onSubmitPage = this._onSubmitPage.bind(this);
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

    // add .has-success or .has-error
    // .glyphicon-ok or .glyphicon-remove
    let placeholderCopy = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi iaculis est lectus, posuere scelerisque massa rhoncus in. Vestibulum facilisis purus non velit porttitor, non imperdiet erat condimentum.";
    return (
      <div className="row">
        <div className="col-xs-4">
          <h1>Add Event</h1>
          <p className="lead"><em>Add an event to the homepage.</em></p>
          <form className="" role="form" onSubmit={this._onSubmitEvent}>
            <div className="form-group">
                <input ref="eventTitle" className="form-control input-lg" type="text" placeholder="Headline" />
            </div>
            <div className="form-group">
              <textarea ref="eventDescription" className="form-control input-lg" rows="3" placeholder="Enter short description"></textarea>
            </div>
            <button type="submit" className="btn btn-info">
              <span className="glyphicon glyphicon-ok-sign"></span>
              {' Add Event'}
            </button>
          </form>
        </div>
        <div className="col-xs-8">
          <h1>Add Page</h1>
          <p className="lead"><em>Optionally add details page.</em></p>
          <form className="" role="form" onSubmit={this._onSubmitPage}>
            <div className="form-group">
                <input ref="pageTitle" className="form-control input-lg" type="text" placeholder="Headline" />
            </div>
            <div className="form-group">
              <textarea ref="pageDescription" className="form-control input-lg" rows="5" placeholder={placeholderCopy}></textarea>
            </div>
            <button type="submit" className="btn btn-success">
              <span className="glyphicon glyphicon-plus-sign"></span>
              {' Add Event + Page'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  _getEventData() {
    return {
      title: this.refs.eventTitle.value,
      description: this.refs.eventDescription.value,
    };
  }

  _getPageData() {
    return {
      title: this.refs.pageTitle.value,
      description: this.refs.pageDescription.value,
    };
  }

  _onSubmitPage(e) {
    e.preventDefault();
    var data = {
      event: this._getEventData(),
      page: this._getPageData(),
    };
    console.log('_onSubmitPage', data);
  }

  _onSubmitEvent(e) {
    e.preventDefault();
    var data = this._getEventData();
    console.log('_onSubmitEvent', data);
  }

  _onUserChange(user) {
    this.setState({authorized: !! user.id});
  }
}