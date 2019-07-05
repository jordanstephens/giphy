import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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

    const { grid_gutter_px, grid_column_width_px } = configuration;
    this._masonry = undefined;
    this._columnCount = 0;

    this._cache = new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: grid_column_width_px,
      fixedWidth: true,
    });

    this._cellPositioner = createMasonryCellPositioner({
      cellMeasurerCache: this._cache,
      columnCount: this._getColumnCount(window.innerWidth),
      columnWidth: grid_column_width_px,
      spacer: grid_gutter_px
    });

    this._onResize = this._onResize.bind(this);
    this._cellRenderer = this._cellRenderer.bind(this);
    this._getColumnCount = this._getColumnCount.bind(this);
  }

  _getColumnCount(width) {
    const { grid_gutter_px, grid_padding_px, grid_column_width_px } = configuration;
    return Math.floor(
      (width - (2 * grid_padding_px)) / (grid_column_width_px + grid_gutter_px)
    );
  }

  _onResize({ width }) {
    const { grid_gutter_px, grid_column_width_px } = configuration;
    this._cache.clearAll();
    this._cellPositioner.reset({
      columnCount: this._getColumnCount(width),
      columnWidth: grid_column_width_px,
      spacer: grid_gutter_px,
    });
    this._masonry.recomputeCellPositions();
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
          <Link
            to={`/gif/${gif.id}`}
          >
            <picture>
              <source srcSet={image.webp} type="image/webp" />
              <img
                src={image.url}
                alt={gif.title}
                height={image.height}
                width={image.width}
                style={{
                  height: image.height,
                  width: image.width
                }}
              />
            </picture>
            <h4>{gif.title}</h4>
          </Link>
        </div>
      </CellMeasurer>
    );
  }

  render() {
    const { gifs, onScrollBottom } = this.props;
    if (!gifs.length) return null;
    const { grid_gutter_px, grid_column_width_px } = configuration;
    return (
      <WindowScroller
        overscanByPixels={configuration.overscan_px}
        onResize={this._onResize}
      >
        {({ height, width, isScrolling, onChildScroll, scrollTop }) => {
          const columnCount = this._getColumnCount(width);
          const containerWidth = (columnCount * grid_column_width_px) + ((columnCount - 1) * grid_gutter_px);
          return (
            <div style={{ margin: '0 auto', width: containerWidth }}>
              <Masonry
                ref={(r) => this._masonry = r}
                autoHeight={true}
                height={height}
                isScrolling={isScrolling}
                onScroll={(...args) => {
                  const [{ clientHeight, scrollHeight }] = args;
                  const threshold = clientHeight * configuration.page_bumper_ratio;
                  if (scrollTop + clientHeight > scrollHeight - threshold) {
                    onScrollBottom();
                  }
                  onChildScroll(...args);
                }}
                scrollTop={scrollTop}
                cellCount={gifs.length}
                cellMeasurerCache={this._cache}
                cellPositioner={this._cellPositioner}
                cellRenderer={this._cellRenderer}
                width={width}
              />
            </div>
          );
        }}
      </WindowScroller>
    );
  }
}

GifList.propTypes = {
  gifs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    images: PropTypes.shape({
      fixed_width: PropTypes.shape({
        url: PropTypes.string.isRequired,
        webp: PropTypes.string.isRequired,
        width: PropTypes.string.isRequired,
        height: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  })).isRequired,
  onScrollBottom: PropTypes.func.isRequired,
};