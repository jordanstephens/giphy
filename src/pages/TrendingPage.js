import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions as trendingActions } from '../features/trending';
import { bindActionCreators } from 'redux';
import ContentContainer from '../containers/ContentContainer';
import GifList from '../components/GifList';

class TrendingPage extends React.Component {
  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.reset();
    actions.loadNextPage();
  }

  loadMore() {
    const { actions } = this.props;
    actions.loadNextPage();
  }

  render() {
    const { gifs, loading, error } = this.props;
    return (
      <ContentContainer loading={loading} error={error}>
        <GifList
          gifs={gifs}
          onScrollBottom={this.loadMore}
        />
      </ContentContainer>
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
