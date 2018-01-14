'use strict';

// Props:
//  - activeNode: chrome.bookmarks.BookmarkTreeNode
//  - onDone: () => void
//  - onCancel: () => void
class Deleter extends Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    this.capture.focus();
  }

  onKeyDown(event) {
    switch(event.key) {
      case 'Enter':
      this.save();
      break;

      case 'Escape':
      event.preventDefault();
      this.props.onCancel();
      break;
    }
  }

  save() {
    Store.remove(this.props.activeNode).then(this.props.onDone);
  }

  render(props) {
    return h('div', {class: 'Deleter-root'},
      h('div', {class: 'Deleter-form'},
        h(CancelButton, {onClick: props.onCancel}),
        h('a', {
          class: 'Deleter-inner',
          href: '#',
          ref: el => {this.capture = el},
          onKeyDown: this.onKeyDown,
        }, `delete "${props.activeNode.title}"?`),
      ),
      h(SaveButton, {
        class: 'deleter',
        disabled: false,
        value: 'delete',
        onClick: this.save,
      }),
    );
  }
}
