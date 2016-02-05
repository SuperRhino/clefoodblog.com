import React from 'react';

import Utils from '../Utils/Utils';
import ApiRequest from '../Api/ApiRequest';
import CurrentUser from '../Stores/CurrentUser';

export default class PageInventory extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      authorized: true,
      user: this.props.user,
    };

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

    return (
      <div>Page Inventory</div>
    );
  }

  _onUserChange(user) {
    this.setState({authorized: !! user.id});
  }
}


var styles = {
  container: {},
};