import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  WindowScroller,
  AutoSizer
} from 'react-virtualized';

import { timeago } from '../utils/timeago';
import configuration from '../configuration';

import './GifList.css';

export default class GifList extends React.PureComponent {
  constructor(props) {
    super(props);

    const { grid_column_width_px } = configuration;
    this._masonry = undefined;
    this._columnCount = 0;

    this._cache = new CellMeasurerCache({
      defaultWidth: grid_column_width_px,
      defaultHeight: grid_column_width_px,
      fixedWidth: true,
    });

    this._onResize = this._onResize.bind(this);
    this._cellRenderer = this._cellRenderer.bind(this);
    this._updateColumnCount = this._updateColumnCount.bind(this);
    this._resetCellPositioner = this._resetCellPositioner.bind(this);
    this._setMasonryRef = this._setMasonryRef.bind(this);
    this._initCellPositioner = this._initCellPositioner.bind(this);
    this._checkScrollBottom = this._checkScrollBottom.bind(this);

    this.loadInterval = undefined;
    this.loadTimer = undefined;
  }

  componentDidMount() {
    // The `setInterval` here is a pretty messy hack to continue to load content
    // when the window height is greater than the content height. When this is
    // true, the user can't scroll, and will therefore be forever stuck on the
    // first page, because new content can never be loaded.
    // This is further compounded by the fact that the `Masonry` component seems
    // to have set the content height to be an estimate of the necessary height
    // when this callback gets called. This estimate can be wildly incorrect,
    // so we need to wait a short amt of time for the content height to settle
    // before determining if we need to load new content or not.
    const {
      max_fill_screen_loads,
      fill_screen_timeout,
      fill_screen_interval
    } = configuration;
    let count = 0;
    window.setTimeout(() => {
      this.loadInterval = window.setInterval(() => {
        if (count > max_fill_screen_loads) {
          return window.clearInterval(this.loadInterval);
        }
        if (this._checkScrollBottom()) {
          window.clearInterval(this.loadInterval);
        }
        count++;
      }, fill_screen_interval);
    }, fill_screen_timeout);
  }

  componentWillUnmount() {
    window.clearInterval(this.loadInterval);
    window.clearTimeout(this.loadTimer);
  }

  _checkScrollBottom() {
    const contentHeight = document.body.clientHeight;
    const threshold = contentHeight * configuration.page_bumper_ratio;
    if (contentHeight > window.innerHeight + threshold) return true;
    this.props.onScrollBottom();
    return false;
  }

  _updateColumnCount() {
    const { grid_gutter_px, grid_column_width_px } = configuration;
    this._columnCount = Math.floor(
      this._width / (grid_column_width_px + grid_gutter_px)
    );
  }

  _initCellPositioner() {
    if (typeof this._cellPositioner === 'undefined') {
      const { grid_gutter_px, grid_column_width_px } = configuration;

      this._cellPositioner = createMasonryCellPositioner({
        cellMeasurerCache: this._cache,
        columnCount: this._columnCount,
        columnWidth: grid_column_width_px,
        spacer: grid_gutter_px,
      });
    }
  }

  _onResize(args) {
    const { width } = args;
    this._width = width;
    this._updateColumnCount();
    this._resetCellPositioner();
    this._masonry.recomputeCellPositions();
    this._checkScrollBottom();
  }

  _cellRenderer ({ index, key, parent, style }) {
    const gif = this.props.gifs[index];
    const image = gif.images.fixed_width;
    const colors = configuration.colors;
    const backgroundColor = colors[gif.id.charCodeAt('0') % colors.length];

    return (
      <CellMeasurer cache={this._cache} index={index} key={key} parent={parent}>
        <div className='gif-container' style={style}>
          <Link
            to={`/gif/${gif.id}`}
            className='gif-container-link'
          >
            <picture>
              <source srcSet={image.webp} type="image/webp" />
              <img
                src={image.url}
                alt={gif.title}
                height={image.height}
                width={image.width}
                style={{ backgroundColor }}
              />
            </picture>
            <div className='hover-overlay'>
              <h4 className='gif-title'>
                {gif.title}
              </h4>
              <span className='gif-time'>
                {timeago(gif.import_datetime)}
              </span>
            </div>
          </Link>
        </div>
      </CellMeasurer>
    );
  }

  render() {
    const { gifs, onScrollBottom } = this.props;
    if (!gifs.length) return (
      <div>There are no results to show</div>
    );
    const { overscan_px } = configuration;

    return (
      <WindowScroller
        overscanByPixels={overscan_px}
      >
        {({ height, isScrolling, onChildScroll, scrollTop }) => {
          this._height = height;
          this._scrollTop = scrollTop;
          return (
            <AutoSizer
              disableHeight={true}
              height={height}
              onResize={this._onResize}
              overscanByPixels={overscan_px}
              scrollTop={scrollTop}
            >
              {({ width }) => {
                this._width = width;

                this._updateColumnCount();
                this._initCellPositioner();

                return (
                  <Masonry
                    autoHeight={true}
                    cellCount={gifs.length}
                    cellMeasurerCache={this._cache}
                    cellPositioner={this._cellPositioner}
                    cellRenderer={this._cellRenderer}
                    height={this._height}
                    overscanByPixels={overscan_px}
                    ref={this._setMasonryRef}
                    scrollTop={this._scrollTop}
                    width={width}
                    isScrolling={isScrolling}
                    onScroll={(...args) => {
                      const [{ clientHeight, scrollHeight }] = args;
                      const threshold = clientHeight * configuration.page_bumper_ratio;
                      if (this._scrollTop + clientHeight > scrollHeight - threshold) {
                        onScrollBottom();
                      }
                      onChildScroll(...args);
                    }}
                  />
                );
              }}
            </AutoSizer>
          );
        }}
      </WindowScroller>
    );
  }

  _resetCellPositioner() {
    const { grid_gutter_px, grid_column_width_px } = configuration;

    this._cellPositioner.reset({
      columnCount: this._columnCount,
      columnWidth: grid_column_width_px,
      spacer: grid_gutter_px,
    });
  }

  _setMasonryRef(ref) {
    this._masonry = ref;
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
    import_datetime: PropTypes.string.isRequired,
  })).isRequired,
  onScrollBottom: PropTypes.func.isRequired,
};

GifList.defaultProps = {
  gifs: []
};