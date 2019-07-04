import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions as gifActions } from '../features/gif';
import { bindActionCreators } from 'redux';
import ContentContainer from '../containers/ContentContainer';
import GifView from '../components/GifView';

class GifPage extends React.Component {
  componentDidMount() {
    const { actions, match } = this.props;

    actions.reset();
    actions.loadGif(match.params.id);
  }

  render() {
    const { gif, loading, error } = this.props;
    return (
      <ContentContainer loading={loading} error={error}>
        <GifView gif={gif} />
      </ContentContainer>
    );
  }
}

GifPage.propTypes = {
  actions: PropTypes.shape({
    loadGif: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  gif: PropTypes.shape({}),
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  error: PropTypes.shape({})
};

const mapStateToProps = ({ gif }) => ({
  loading: gif.loading,
  error: gif.error,
  gif: gif.gif
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(gifActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GifPage);
