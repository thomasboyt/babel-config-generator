/*
 * Include imports executed for side effects, like CSS, here.
 */

import {LOAD_FEATURES} from './ActionTypes';

require('../styles/app.scss');

/*
 * Initialization hook that is run before the app is rendered.
 *
 * Use to e.g. load custom data into your store
 */

export default function init(store) {  // eslint-disable-line no-unused-vars
  const features = require('json!yaml!./features.yaml');

  store.dispatch({
    type: LOAD_FEATURES,
    data: features,
  });
}
