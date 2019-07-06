/*global expect*/
import * as fs from 'fs';
import React from 'react';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router';
import renderer from 'react-test-renderer';
import GifList from './GifList';
import * as timeago from '../utils/timeago';

const fixture = JSON.parse(fs.readFileSync('src/services/fixtures/trending.json'));

function render(props = {}) {
  return renderer.create(
    <MemoryRouter>
      <GifList {...props} />
    </MemoryRouter>
  ).toJSON();
}

let sandbox;

beforeEach(() => {
  sandbox = sinon.createSandbox();
  sandbox.stub(timeago, 'timeago').returns('2 hours ago');
});

afterEach(() => sandbox.restore());

it('renders without gifs', () => {
  const tree = render({ onScrollBottom: () => {} });
  expect(tree).toMatchSnapshot();
});

it('renders with gifs', () => {
  const tree = render({ gifs: fixture.data, onScrollBottom: () => {} });
  expect(tree).toMatchSnapshot();
});
