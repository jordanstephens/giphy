import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  WindowScroller
} from 'react-virtualized';

import configuration from '../configuration';

export default class GifList extends React.PureComponent {
  constructor(props) {
    super(props);

    this._columnCount = 0;

    this._cache = new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 200,
      fixedWidth: true,
    });

    this._cellPositioner = createMasonryCellPositioner({
      cellMeasurerCache: this._cache,
      columnCount: 3,
      columnWidth: 200,
      spacer: 10
    });

    this._cellRenderer = this._cellRenderer.bind(this);
  }

  _cellRenderer ({ index, key, parent, style }) {
    const gif = this.props.gifs[index];
    const image = gif.images.fixed_width;

    return (
      <CellMeasurer
        cache={this._cache}
        index={index}
        key={key}
        parent={parent}
      >
        <div style={style}>
          <img
            src={image.url}
            alt={gif.title}
            style={{
              height: image.height,
              width: image.width
            }}
          />
          <h4>{gif.title}</h4>
        </div>
      </CellMeasurer>
    );
  }

  render() {
    const { gifs, onLoadMore } = this.props;
    if (!gifs.length) return null;
    return (
      <WindowScroller overscanByPixels={configuration.overscan_px}>
        {({ height, width, isScrolling, onChildScroll, scrollTop }) => (
          <Fragment>
            <Masonry
              autoHeight={true}
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              scrollTop={scrollTop}
              cellCount={gifs.length}
              cellMeasurerCache={this._cache}
              cellPositioner={this._cellPositioner}
              cellRenderer={this._cellRenderer}
              width={width}
            />
            <div>
              <button onClick={onLoadMore}>Load More</button>
            </div>
          </Fragment>
        )}
      </WindowScroller>
    );
  }
}

GifList.propTypes = {
  gifs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    images: PropTypes.shape({
      fixed_width: PropTypes.shape({
        url: PropTypes.string.isRequired,
        width: PropTypes.string.isRequired,
        height: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  })).isRequired,
  onLoadMore: PropTypes.func.isRequired,
};