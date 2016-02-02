import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {addFeature, removeFeature, addPreset, removePreset} from '../../actions/FeatureActions';

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

      return (
        <li key={key} className="list-inline-item">
          <label className={classNames('checkbox-inline', {'selected': isSelected})}>
            <input type="checkbox" checked={isSelected}
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

        <ul className="list-inline">
          {this.renderPresets()}
        </ul>

        <ul className="list-unstyled">
          {this.renderFeaturesSections()}
        </ul>
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

export default connect(select)(FeaturePicker);
