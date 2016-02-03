import I from 'immutable';

function keyIn(keys) {
  var keySet = I.Set(keys); 
  return (v, k) => {
    return keySet.has(k);
  };
}

function featureInPresets(presets, featureKey) {
  return presets.some((preset) => {
    // TODO: convert features to set and use has() instead of includes()
    return preset.get('features').includes(featureKey);
  });
}

/*
 * Return selected features and presets.
 *
 * Includes presets that are dependencies of selected presets. Filters out selected features that
 * are included in a selected preset.
 */
export function getSelected(state) {
  const presets = state.presets
    .filter(keyIn(state.selectedPresets))
    .update((presets) => {
      const presetDependencyKeys = presets
        .filter((preset) => preset.get('presets'))
        .map((preset) => preset.get('presets'))
        .toList()
        .flatten();

      const presetDependencies = I.Map(presetDependencyKeys.map((key) => [key, state.presets.get(key)]));
      return presets.merge(presetDependencies);
    });

  // filter out features that are already in a preset
  const features = state.features
    .filter(keyIn(state.selectedFeatures))
    .filter((feature, key) => !featureInPresets(presets, key));

  return {features, presets};
}
