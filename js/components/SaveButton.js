'use strict';

// Props:
//  - class: ?string
//  - disabled: boolean
//  - value: string
//  - onClick: () => void
const SaveButton = (props) =>
  h('div', {
    class: `SaveButton${props.disabled ? ' disabled' : ''}${props.class ? ` ${props.class}` : ''}`,
    onClick: props.onClick,
  }, props.value);
