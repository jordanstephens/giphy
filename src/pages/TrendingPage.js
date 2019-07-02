import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions as trendingActions } from '../features/trending';
import { bindActionCreators } from 'redux';

class TrendingPage extends React.Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.reset();
    actions.loadNextPage();
  }

  render() {
    return (
      <div>Trending</div>
    );
  }
}

TrendingPage.propTypes = {
  actions: PropTypes.shape({
    loadNextPage: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  gifs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({})
};

const mapStateToProps = ({ trending }) => ({
  loading: trending.loading,
  error: trending.error,
  gifs: trending.gifs
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(trendingActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendingPage);