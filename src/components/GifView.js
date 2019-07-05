import React from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';
import configuration from '../configuration';

import './GifView.css';

const GifView = ({ gif }) => {
  if (!gif) return null;

  const image = gif.images.original;
  const colors = configuration.colors;
  const backgroundColor = colors[gif.id.charCodeAt('0') % colors.length];

  return (
    <section>
      <div>
        <header>
          <h2>{gif.title}</h2>
        </header>
        <main>
          <picture>
            <source srcSet={image.webp} type="image/webp" />
            <img
              src={image.url}
              alt={gif.title}
              height={image.height}
              width={image.width}
              style={{ backgroundColor }}
              className='gif'
            />
          </picture>
        </main>
      </div>
      <footer>
        <dl className='gif-info'>
          <dt>Source</dt>
          <dd>
            <a
              href={gif.source}
              target='_blank'
              rel='noopener noreferrer'
            >
              {gif.source_tld}
            </a>
          </dd>
          <dt>Rating</dt>
          <dd>{gif.rating.toUpperCase()}</dd>
          <dt>Uploaded</dt>
          <dd>{new Date(gif.import_datetime).toLocaleDateString()}</dd>
          <dt>Dimensions</dt>
          <dd>{image.width} x {image.height} px</dd>
          <dt>Size</dt>
          <dd>{filesize(image.size)}</dd>
          <dt>Frames</dt>
          <dd>{image.frames}</dd>
        </dl>
      </footer>
    </section>
  );
};

GifView.propTypes = {
  gif: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    source_tld: PropTypes.string.isRequired,
    import_datetime: PropTypes.string.isRequired,
    images: PropTypes.shape({
      original: PropTypes.shape({
        webp: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        size: PropTypes.string.isRequired,
        frames: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }),
};

export default GifView;
