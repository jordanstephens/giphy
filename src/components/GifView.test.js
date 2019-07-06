/*global expect*/
import * as fs from 'fs';
import React from 'react';
import GifView from './GifView';
import renderer from 'react-test-renderer';

const fixture = JSON.parse(fs.readFileSync('src/services/fixtures/gif.json'));

function render(props = {}) {
  return renderer.create(
    <GifView {...props} />
  ).toJSON();
}

it('renders without a gif', () => {
  const tree = render({});
  expect(tree).toMatchSnapshot();
});

it('renders with a gif', () => {
  const tree = render({ gif: fixture.data });
  expect(tree).toMatchSnapshot();
});
