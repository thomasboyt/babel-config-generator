import {ADD_FEATURE, REMOVE_FEATURE, ADD_PRESET, REMOVE_PRESET} from '../ActionTypes';

export function addFeature(key) {
  return {
    type: ADD_FEATURE,
    key
  };
}

export function removeFeature(key) {
  return {
    type: REMOVE_FEATURE,
    key
  };
}

export function addPreset(key) {
  return {
    type: ADD_PRESET,
    key
  };
}

export function removePreset(key) {
  return {
    type: REMOVE_PRESET,
    key
  };
}
