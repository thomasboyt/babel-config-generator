import React from 'react';

const SelectPre = React.createClass({
  highlight() {
    const node = this.refs.pre;
    const selection = window.getSelection();        
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  },

  render() {
    return (
      <pre onClick={this.highlight} ref="pre">
        {this.props.children}
      </pre>
    );
  }
});

export default SelectPre;
