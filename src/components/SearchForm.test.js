/*global expect*/
import React from 'react';
import SearchForm from './SearchForm';
import renderer from 'react-test-renderer';

it('renders without q', () => {
  const tree = renderer
    .create(<SearchForm onSubmit={() => {}} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders with q', () => {
  const tree = renderer
    .create(<SearchForm q='test' onSubmit={() => {}} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
