import createImmutableReducer from '../util/immutableReducer';
import I from 'immutable';

import {
  LOAD_FEATURES,
  ADD_FEATURE,
  REMOVE_FEATURE,
  ADD_PRESET,
  REMOVE_PRESET,
} from '../ActionTypes';

const State = I.Record({
  features: null,
  presets: null,
  selectedFeatures: I.Set(),
  selectedPresets: I.Set(),
});

const featureReducer = createImmutableReducer(new State(), {
  [LOAD_FEATURES]: function({data}, state) {
    return state.merge({
      features: I.fromJS(data.features),
      presets: I.fromJS(data.presets)
    });
  },

  [ADD_FEATURE]: function({key}, state) {
    return state.
      update('selectedFeatures', (selectedFeatures) => selectedFeatures.add(key));
  },

  [REMOVE_FEATURE]: function({key}, state) {
    return state.
      update('selectedFeatures', (selectedFeatures) => selectedFeatures.delete(key));
  },

  [ADD_PRESET]: function({key}, state) {
    return state.
      update('selectedPresets', (selectedPresets) => selectedPresets.add(key));
  },

  [REMOVE_PRESET]: function({key}, state) {
    return state.
      update('selectedPresets', (selectedPresets) => selectedPresets.delete(key));
  },
});

export default featureReducer;
