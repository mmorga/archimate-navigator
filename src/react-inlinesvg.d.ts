// Type definitions for react-inlinesvg 0.8.1
// Project: https://github.com/gilbarbara/react-inlinesvg
// Definitions by: Mark Morga markmorga.com

import * as React from 'react';

declare module 'react-inlinesvg' {
  namespace SVG {

    export interface IRequestError { // TODO: this extends an XHR Request Error
      isHttpError: boolean;
      status: number;
    }

    export interface IInlineSVGError {
      name: string; // 'InlineSVGError',
      isSupportedBrowser: boolean;
      isConfigurationError: boolean;
      isUnsupportedBrowserError: boolean;
      message: string;
    }

    export interface SVGProps extends React.HTMLProps<SVG> {
      /** The SVG file you want to load. It can be an url or a string (base64 or encoded) */
      src: string;

      /** A React class or a function that returns a component instance to be used as the wrapper component.
           Default: ▶︎ React.createFactory('span')
      */
      // wrapper?: React.Component | ((void) => JSX.Element);

      /** A component to be shown while the SVG is loading. */
      preloader?: JSX.Element;

      /** A class to add to the default wrapper. */
      className?: string;

      /**  Only request SVGs once. Default: false */
      cacheGetRequests?: boolean;

      /** Create unique IDs for each icon. Default: true */
      uniquifyIDs?: boolean;

      /** A string to use with uniquifyIDs. */
      uniqueHash?: string;

      /** An URL to prefix each ID in case you are using the <base> tag. */
      baseURL?: string;

      /** A callback to be invoked upon successful load.
          This will receive 2 arguments: the src prop and a isCached boolean

          Which returns a random 8 characters string [A-Za-z0-9]
      */
      // onLoad?: (src?: string, isCached?: boolean) => void;
      onLoad?: (src?: string | React.SyntheticEvent<SVG>, isCached?: boolean) => void;

      /** A callback to be invoked if loading the SVG fails.
          This will receive a single argument error argument.
      */
      onError?: (err: React.SyntheticEvent<SVG> | IRequestError | IInlineSVGError) => void;
    }
  }

  export default class SVG extends React.Component<SVG.SVGProps> { }
}
