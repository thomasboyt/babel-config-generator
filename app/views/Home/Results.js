import React from 'react';
import {connect} from 'react-redux';
import I from 'immutable';
import range from 'lodash.range';

import SelectPre from './SelectPre';

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

function getConfig({features, presets}) {
  const presetConfig = presets.map((preset, name) => name).toList().toJS();

  // filter
  const pluginConfig = features.map((preset, key) => 'babel-plugin-' + key).toList().toJS();

  return JSON.stringify({
    presets: presetConfig,
    plugins: pluginConfig,
  }, null, '  ');
}

function getInstallCommand({features, presets}) {
  const presetPackages = presets
    .map((preset, name) => `babel-preset-${name}`).toList();

  const featurePackages = features.map((feature, key) => {
    const defaultPluginName = `babel-plugin-${key}`;

    let plugins;

    if (feature.get('plugins')) {
      plugins = feature.get('plugins');
    } else {
      plugins = I.List([defaultPluginName]);
    }

    if (feature.get('runtime')) {
      plugins = plugins.push(feature.get('runtime'));
    }

    return plugins;
  }).toList().flatten();

  const prefixCmd = 'npm install --save-dev ';
  const indentation = range(0, prefixCmd.length).map(() => ' ').join('');
  const packages = I.List(['babel', 'babel-core'])
    .concat(presetPackages)
    .concat(featurePackages).toJS().join(` \\\n${indentation}`);

  return `${prefixCmd}${packages}`;
}

const Results = React.createClass({
  getSelected() {
    const presets = this.props.presets.filter(keyIn(this.props.selectedPresets));

    // filter out features that are already in a preset
    const features = this.props.features
      .filter(keyIn(this.props.selectedFeatures))
      .filter((feature, key) => !featureInPresets(presets, key));

    return {features, presets};
  },

  renderConfig() {
    return (
      <SelectPre>
        {getConfig(this.getSelected())}
      </SelectPre>
    );
  },

  renderInstallCommand() {
    return (
      <SelectPre>
        {getInstallCommand(this.getSelected())}
      </SelectPre>
    );
  },

  render() {
    return (
      <div>
        <h3>Config</h3>

        <p>
          Save this as <code>.babelrc</code> in your project's root directory.
        </p>

        {this.renderConfig()}

        <p>
          <em>(click above to select)</em>
        </p>

        <h3>Get Packages</h3>

        <p>
          Run this to install required dependencies and save them to your project's <code>package.json</code>.
        </p>

        {this.renderInstallCommand()}

        <p>
          <em>(click above to select)</em>
        </p>
      </div>
    );
  }
});

function select(state) {
  return {
    presets: state.features.presets,
    features: state.features.features,
    selectedPresets: state.features.selectedPresets,
    selectedFeatures: state.features.selectedFeatures,
    sections: state.features.sections,
  };
}

export default connect(select)(Results);
