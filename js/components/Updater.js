'use strict';

// Props:
//  - activeNode: chrome.bookmarks.BookmarkTreeNode
//  - onDone: () => void
//  - onCancel: () => void
class Updater extends Component {
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

  async save() {
    const [tabs] = await AsyncChrome.Tabs.query({currentWindow: true, active: true});
    if (tabs) {
      await Store.update(this.props.activeNode, {url: tabs[0].url});
      this.props.onDone();
    }
  }

  render(props) {
    return h('div', {class: 'Updater-root'},
      h('div', {class: 'Updater-form'},
        h(CancelButton, {onClick: props.onCancel}),
        h('a', {
          class: 'Updater-inner',
          href: '#',
          ref: el => {this.capture = el},
          onKeyDown: this.onKeyDown,
        }, `overwrite "${props.activeNode.title}"?`),
      ),
      h(SaveButton, {
        disabled: false,
        value: 'overwrite',
        onClick: this.save,
      }),
    );
  }
}
