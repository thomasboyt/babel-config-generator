import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {addFeature, removeFeature, addPreset, removePreset} from '../../actions/FeatureActions';
import {getSelected} from '../../selectors/features';

function sortedMap(map) {
  return map.toOrderedMap().sortBy((val) => val.get('name'));
}

const FeaturePicker = React.createClass({
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

  renderUsageNotes(key, feature) {
    const runtime = feature.get('runtime');

    if (runtime) {
      return (
        <div>
          <p>
            <span className="text-danger"><strong>This plugin requires a runtime polyfill. </strong></span>
            Add this to your application's entry point before importing any code using it:
          </p>
          <pre>
            {`require('${runtime}');`}
          </pre>
        </div>
      );
    }

    return null;
  },

  renderSection(section) {
    const sectionName = this.props.sections.get(section);

    const features = this.props.features.filter((feature) => feature.get('section') === section);

    const featureItems = sortedMap(features).map((feature, key) => {
      const isSelected = this.props.selectedFeatures.has(key);

      const inPreset = this.props.selectedPresets.some((feature, name) => {
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

          {(isSelected || inPreset) && this.renderUsageNotes(key, feature)}
        </li>
      );
    }).toList().toJS();

    return (
      <div className="feature-section">
        <h4>{sectionName}</h4>
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
      // If it's in the original names, it was actually clicked by the user. Otherwise it's a
      // dependency of a selected preset
      const isDependency = isSelected && !this.props.selectedPresetNames.has(key);

      return (
        <li key={key} className="list-inline-item">
          <label className={classNames('checkbox-inline', {'selected': isSelected})}>
            <input type="checkbox" checked={isSelected} disabled={isDependency}
              onChange={(e) => this.togglePreset(key, e)} />
            {' '}
            {key}
          </label>
        </li>
      );
    }).toList().toJS();
  },

  render() {
    return (
      <div>
        <h3>Presets</h3>

        <div className="feature-section">
          <ul className="list-inline">
            {this.renderPresets()}
          </ul>
        </div>

        {this.renderFeaturesSections()}
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
    selectedPresetNames: state.features.selectedPresets,
  };
}

export default connect(select)(FeaturePicker);
