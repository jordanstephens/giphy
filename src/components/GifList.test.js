/*global expect*/
import * as fs from 'fs';
import React from 'react';
import { MemoryRouter } from 'react-router';
import GifList from './GifList';
import renderer from 'react-test-renderer';

const fixture = JSON.parse(fs.readFileSync('src/services/fixtures/trending.json'));

function render(props = {}) {
  return renderer.create(
    <MemoryRouter>
      <GifList {...props} />
    </MemoryRouter>
  ).toJSON();
}

it('renders without gifs', () => {
  const tree = render({ onScrollBottom: () => {} });
  expect(tree).toMatchSnapshot();
});

it('renders with gifs', () => {
  const tree = render({ gifs: fixture.data, onScrollBottom: () => {} });
  expect(tree).toMatchSnapshot();
});
