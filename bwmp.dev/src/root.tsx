import { component$, isDev } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city';
import { RouterHead } from './components/head';

import './global.css';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <>
            <link
              rel="manifest"
              href={`${import.meta.env.BASE_URL}manifest.json`}
            />
            <script
              defer
              src="https://umami.bwmp.dev/script.js"
              data-website-id="8b67ff47-6901-4d08-92d6-572477ef0468"
            />
          </>
        )}
        <RouterHead />
      </head>
      <body lang="en" class="bg-bg text-lum-text">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
