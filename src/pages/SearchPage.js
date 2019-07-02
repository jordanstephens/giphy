import React from 'react';
import PropTypes from 'prop-types';
import QueryString from 'query-string';
import { connect } from 'react-redux';
import { actions as searchActions } from '../features/search';
import { bindActionCreators } from 'redux';
import ContentContainer from '../containers/ContentContainer';
import GifList from '../components/GifList';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    const { actions, location } = this.props;
    const { q } = QueryString.parse(location.search.slice(1));
    actions.reset();
    actions.loadNextPage({ q });
  }

  componentWillReceiveProps(nextProps) {
    const { actions, location } = this.props;
    const { location: nextLocation } = nextProps;

    if (location !== nextLocation) {
      const { q } = QueryString.parse(nextLocation.search.slice(1));
      actions.reset();
      actions.loadNextPage({ q });
    }
  }

  loadMore() {
    const { actions, location } = this.props;
    const { q } = QueryString.parse(location.search.slice(1));
    actions.loadNextPage({ q });
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

SearchPage.propTypes = {
  actions: PropTypes.shape({
    loadNextPage: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  gifs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.shape({})
};

const mapStateToProps = ({ search }) => ({
  loading: search.loading,
  error: search.error,
  gifs: search.gifs
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(searchActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPage);
