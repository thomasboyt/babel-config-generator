import React from 'react';
import I from 'immutable';
import {connect} from 'react-redux';
import range from 'lodash.range';

import {getSelected} from '../../selectors/features';

import SelectPre from './SelectPre';

function getPlugins(features) {
  return features.map((feature, key) => {
    let plugins;

    if (feature.get('plugins')) {
      plugins = feature.get('plugins').map((pluginNameOrList) => {
        if (pluginNameOrList instanceof I.List) {
          return pluginNameOrList.update(0, (pluginName) => pluginName.replace('babel-plugin-', ''));
        } else {
          return pluginNameOrList.replace('babel-plugin-', '');
        }
      });

    } else {
      plugins = I.List([key]);
    }

    return plugins;
  }).toList().flatten(true);
}

function getConfig({features, presets}) {
  const presetCfg = presets.map((preset, name) => name).toList().toJS();

  // filter
  const plugins = getPlugins(features);

  return JSON.stringify({
    presets: presetCfg,
    plugins,
  }, null, '  ');
}

function getPackages(features) {
  return features.map((feature, key) => {
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
}

function getInstallCommand({features, presets}) {
  const presetPackages = presets
    .map((preset, name) => `babel-preset-${name}`).toList();

  const featurePackages = getPackages(features);

  const prefixCmd = 'npm install --save-dev ';
  const indentation = range(0, prefixCmd.length).map(() => ' ').join('');
  const packages = I.List(['babel', 'babel-core'])
    .concat(presetPackages)
    .concat(featurePackages).toJS().join(` \\\n${indentation}`);

  return `${prefixCmd}${packages}`;
}

const Results = React.createClass({
  renderConfig() {
    return (
      <SelectPre>
        {getConfig({
          features: this.props.selectedFeatures,
          presets: this.props.selectedPresets,
        })}
      </SelectPre>
    );
  },

  renderInstallCommand() {
    return (
      <SelectPre>
        {getInstallCommand({
          features: this.props.selectedFeatures,
          presets: this.props.selectedPresets,
        })}
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
  const selected = getSelected(state.features);

  return {
    presets: state.features.presets,
    features: state.features.features,
    sections: state.features.sections,
    selectedFeatures: selected.features,
    selectedPresets: selected.presets,
  };
}

export default connect(select)(Results);
