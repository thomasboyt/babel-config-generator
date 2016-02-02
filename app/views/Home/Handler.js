import React from 'react';
import {connect} from 'react-redux';
import I from 'immutable';
import range from 'lodash.range';
import classNames from 'classnames';

import {addFeature, removeFeature, addPreset, removePreset} from '../../actions/FeatureActions';

function sortedMap(map) {
  return map.toOrderedMap().sortBy((val) => val.get('name'));
}

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

const Home = React.createClass({
  toggleFeature(key, e) {
    const checked = e.target.checked;

    if (checked) {
      this.props.dispatch(addFeature(key));
    } else {
      this.props.dispatch(removeFeature(key));
    }
  },

  togglePreset(key, e) {
    const checked = e.target.checked;

    if (checked) {
      this.props.dispatch(addPreset(key));
    } else {
      this.props.dispatch(removePreset(key));
    }
  },

  renderSection(section) {
    const sectionName = this.props.sections.get(section);

    const features = this.props.features.filter((feature) => feature.get('section') === section);

    const featureItems = sortedMap(features).map((feature, key) => {
      const isSelected = this.props.selectedFeatures.has(key);

      const inPreset = this.props.selectedPresets.some((name) => {
        // TODO: convert features to set and use has() instead of includes()
        return this.props.presets.get(name).get('features').includes(key);
      });

      return (
        <li key={key}>
          <div className="checkbox">
            <label className={classNames({'selected': isSelected || inPreset})}>
              <input type="checkbox" style={{position: 'static'}} checked={isSelected || inPreset}
                disabled={inPreset} onChange={(e) => this.toggleFeature(key, e)} />
              {' '}
              {feature.get('name')}
            </label>
          </div>
        </li>
      );
    }).toList().toJS();

    return (
      <div>
        <h3>{sectionName}</h3>
        <ul className="list-unstyled">
          {featureItems}
        </ul>
      </div>
    );
  },

  renderFeaturesSections() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            {this.renderSection('es2015')}
          </div>
          <div className="col-md-4">
            {this.renderSection('es2015-modules')}
            {this.renderSection('experimental')}
          </div>
          <div className="col-md-4">
            {this.renderSection('react')}
            {this.renderSection('other')}
          </div>
        </div>
      </div>
    );
  },

  renderPresets() {
    return this.props.presets.map((preset, key) => {
      const isSelected = this.props.selectedPresets.has(key);

      return (
        <li key={key} className="list-inline-item">
          <label className="checkbox-inline">
            <input type="checkbox" checked={isSelected}
              onChange={(e) => this.togglePreset(key, e)} />
            {' '}
            {key}
          </label>
        </li>
      );
    }).toList().toJS();
  },

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
      <pre>
        {getConfig(this.getSelected())}
      </pre>
    );
  },

  renderInstallCommand() {
    return (
      <pre>
        {getInstallCommand(this.getSelected())}
      </pre>
    );
  },

  render() {
    return (
      <div className="container">
        <h2>Presets</h2>

        <ul className="list-inline">
          {this.renderPresets()}
        </ul>

        <h2>Features</h2>

        <ul className="list-unstyled">
          {this.renderFeaturesSections()}
        </ul>

        <h2>Config</h2>
        {this.renderConfig()}

        <h2>Get Packages</h2>
        {this.renderInstallCommand()}
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

export default connect(select)(Home);
