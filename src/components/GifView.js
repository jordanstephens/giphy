import React from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';

import './GifView.css';

const GifView = ({ gif }) => {
  if (!gif) return null;

  const image = gif.images.original;
  return (
    <section>
      <div>
        <header>
          <h2>{gif.title}</h2>
        </header>
        <main>
          <img src={image.url} width={image.width} height={image.height} alt={gif.title} />
        </main>
      </div>
      <footer>
        <dl>
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
