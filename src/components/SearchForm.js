import React from 'react';
import PropTypes from 'prop-types';

import './SearchForm.css';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q: this.props.q || ''
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSubmit(event) {
    const { q } = this.state;
    this.props.onSubmit(event, { q });
  }

  onChange(event) {
    const q = event.target.value;
    this.setState({ q });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className='search-form'>
        <input
          type="text"
          name="q"
          value={this.state.q}
          placeholder='Search GIFs'
          onChange={this.onChange}
          className='search-field'
        />
        <button type="submit" className='search-button'>
          Go!
        </button>
      </form>
    );
  }
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  q: PropTypes.string
};

export default SearchForm;
