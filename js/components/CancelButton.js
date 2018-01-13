'use strict';

// props:
//  - onClick: () => void
const CancelButton = (props) =>
  h('div', {class: 'CancelButton-root', onClick: props.onClick},
    h('div', {class: 'CancelButton-inner'},
      h('div', {class: 'CancelButton-x'}, '\xd7'),
      h('div', {class: 'CancelButton-esc'}, '[esc]'),
    ),
  );
