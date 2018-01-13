'use strict';

// Props:
//  - activeNode: chrome.bookmarks.BookmarkTreeNode
//  - onDone: () => void
//  - onCancel: () => void
// State:
//  - title: string
//  - url: string
//  - isValid: boolean
//  - errorMessage: ?string
class Editor extends Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.trySave = this.trySave.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onUrlChange = this.onUrlChange.bind(this);
    this.state = {
      title: props.activeNode.title,
      url: props.activeNode.url,
      isValid: true,
      errorMessage: null,
    };
  }

  componentDidMount() {
    this.titleInput.focus();
    this.titleInput.select();
  }

  onKeyDown(event) {
    console.log(event);
    switch (event.key) {
      case 'Enter':
      this.trySave();
      break;

      case 'Escape':
      event.preventDefault();
      this.props.onCancel();
      break;

      case 'ArrowDown':
      event.preventDefault();
      this.urlInput.focus();
      this.urlInput.select();
      break;

      case 'ArrowUp':
      event.preventDefault();
      this.titleInput.focus();
      this.titleInput.select();
      break;
    }
  }

  onTitleChange(event) {
    const val = event.target.value;
    const error = this.getErrorMessage(val, this.state.url);
    this.setState({
      title: val,
      isValid: !error,
      errorMessage: error,
    });
  }

  onUrlChange(event) {
    const val = event.target.value;
    const error = this.getErrorMessage(this.state.title, val);
    this.setState({
      url: val,
      isValid: !error,
      errorMessage: error,
    });
  }

  trySave() {
    if (this.state.isValid) {
      if (this.state.title !== this.props.activeNode.title ||
          this.state.url !== this.props.activeNode.url) {
        Store.update(this.props.activeNode, this.state.title, this.state.url);
      }
      this.props.onDone();
    }
  }

  getErrorMessage(title, url) {
    if (!title.length) {
      return 'keyword is required';
    }
    if (!url.length) {
      return 'destination is required';
    }
    const match = Store.findExact(title);
    if (match && match.id !== this.props.activeNode.id) {
      return 'keyword is already in use';
    }
    return null;
  }

  render(props, state) {
    return h('div', {class: 'Editor-root'},
      h('div', {class: 'Editor-form'},
        h(CancelButton, {onClick: this.props.onCancel}),
        h('div', {class: 'Editor-input-wrapper', onKeyDown: this.onKeyDown},
          h('input', {
            ref: el => {this.titleInput = el},
            type: 'text',
            class: 'Editor-input',
            value: state.title,
            placeholder: 'a memorable keyword',
            onInput: this.onTitleChange,
          }),
          h('input', {
            ref: el => {this.urlInput = el},
            type: 'text',
            class: 'Editor-input',
            value: state.url,
            placeholder: 'destination url',
            onInput: this.onUrlChange,
          }),
        ),
      ),
      h(SaveButton, {
        disabled: !state.isValid,
        value: state.isValid ? 'save [enter]' : state.errorMessage,
        onClick: this.trySave,
      }),
    );
  }
}
