import React from 'react';

import FeaturePicker from './FeaturePicker';
import Results from './Results';

const Home = React.createClass({
  render() {
    return (
      <div>
        <div className="jumbotron">
          <div className="container">
            <h1 className="display-4">
              Babel Configuration Generator
            </h1>
            <p>
              Select presets and features below to generate a Babel configuration file and NPM
              command that will install the required dependencies and save them to your <code>package.json</code>.
            </p>
          </div>
        </div>

        <div className="container">
          <FeaturePicker />
          <Results />
        </div>

        <footer>
          <span>
            By Thomas Boyt. Source on <a href="https://github.com/thomasboyt/babel-config-generator">GitHub</a>.
          </span>
        </footer>
      </div>
    );
  }
});

export default Home;
