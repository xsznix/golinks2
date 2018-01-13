'use strict';

// Props:
//  - onStartEdit: (chrome.bookmarks.BookmarkTreeNode, this.state) -> void
//  - onStartDelete: (chrome.bookmarks.BookmarkTreeNode, this.state) -> void
//  - initialState: this.state
// State:
//  - command: string
//  - typedCommand: string
//  - query: string
//  - selectedIndex: number
//  - suggestions: Array<chrome.bookmarks.BookmarkTreeNode>
class Launcher extends Component {
  constructor(props) {
    super(props);
    this.onInput = this.onInput.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSuggestionHover = this.onSuggestionHover.bind(this);
    this.onSuggestionClick = this.onSuggestionClick.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.refreshSuggestions = this.refreshSuggestions.bind(this);
    this.state = Object.assign({
      command: '',
      typedCommand: '',
      query: '',
      selectedIndex: 0,
      suggestions: [],
    }, props.initialState);
  }

  componentDidMount() {
    this.refocus();
    Store.load().then(() => {
      this.refreshSuggestions();
    });
  }

  onInput(event) {
    const val = event.target.value;
    this.setInputValue(val);
    this.refreshSuggestions();
  }

  onKeyDown(event) {
    switch(event.key) {
      // Go back to editing command if command has already been taken from query
      case 'Backspace':
      if (this.state.query.length === 0 && this.state.command.length) {
        event.preventDefault();
        const newLength = this.state.typedCommand.length + 1;
        this.setState({
          command: '',
          typedCommand: '',
          query: '/' + this.state.typedCommand,
          selectedIndex: 0,
        }, () => {
          document.getElementById('input').setSelectionRange(newLength, newLength);
        });
        this.refreshSuggestions();
      }
      break;

      // Change selection
      case 'ArrowUp':
      case 'ArrowDown':
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      if (this.state.suggestions.length) {
        let nextSelectedIndex =
          (this.state.selectedIndex + delta + this.state.suggestions.length)
          % this.state.suggestions.length;
        this.setState({
          selectedIndex: nextSelectedIndex,
        });
      }
      break;

      // Trigger main action
      case 'Enter':
      event.preventDefault();
      this.executeMainAction();
      break;

      // Don't allow slashes in golink names
      case '/':
      if (this.state.command === 'mark') {
        event.preventDefault();
      }
      break;
    }
  }

  onSuggestionHover(index) {
    if (+new Date - 500 > PAGE_LOAD_TIME && index !== this.state.selectedIndex) {
      this.setState({
        selectedIndex: index,
      });
    }
  }

  onSuggestionClick(index) {
    this.setState({
      selectedIndex: index,
    }, this.executeMainAction);
  }

  refocus() {
    document.getElementById('input').focus();
  }

  executeMainAction() {
    // TODO: mark, edit, delete, list, help
    if (this.state.suggestions.length) {
      const selectedNode = this.state.suggestions[this.state.selectedIndex];
      if (this.state.command === '') {
        if (this.state.query[0] === '/') {
          this.setState({
            command: selectedNode.title,
            typedCommand: selectedNode.title,
            query: '',
            selectedIndex: 0,
          }, () => {
            this.refreshSuggestions();
            document.getElementById('input').select();
          });
        } else {
          Executor.execGolink(selectedNode, this.state.query);
        }
      } else if (this.state.command === 'search') {
        Executor.execChromeBookmark(selectedNode);
      } else if (this.state.command === 'mark') {
        // Don't let the user create duplicate names
        return;
      } else if (this.state.command === 'copy') {
        Executor.execCopy(selectedNode);
      } else if (this.state.command === 'edit') {
        this.props.onStartEdit(selectedNode, this.state);
      }
    } else {
      if (this.state.command === 'mark') {
        Executor.execMark(this.state.query);
      }
    }
  }

  setInputValue(val) {
    if (!this.state.command.length) {
      const maybeCommand = this.maybeParseCommand(val);
      if (maybeCommand) {
        this.setState({
          command: maybeCommand.command,
          typedCommand: maybeCommand.typedCommand,
          query: maybeCommand.rest,
          selectedIndex: 0,
        }, () => {
          document.getElementById('input').select();
        });
        return;
      }
    }

    // Prevent pasting in slashes
    if (this.state.command === 'mark' && val.indexOf('/') !== -1) {
      val = val.replace(/\//g, '');
    }

    this.setState({
      query: val,
      selectedIndex: 0,
    });
  }

  refreshSuggestions() {
    Suggestions.run(this.state.command, this.state.query).then(suggestions => {
      this.setState({suggestions});
    });
  }

  maybeParseCommand(query) {
    if (!query.startsWith('/')) {
      return null;
    }

    const spaceIndex = query.indexOf(' ');
    if (spaceIndex === -1) {
      return null;
    }
    const command = query.substring(1, spaceIndex);
    if (Commands.COMMANDS[command]) {
      return {
        command,
        typedCommand: command,
        rest: query.substring(spaceIndex + 1),
      };
    } else if (Commands.SHORT_COMMANDS[command]) {
      return {
        command: Commands.SHORT_COMMANDS[command],
        typedCommand: command,
        rest: query.substring(spaceIndex + 1),
      };
    } else {
      return null;
    }
  }

  render(props, state) {
    return h('div', {class: 'Popup-root'},
      h('div', {id: 'input-wrapper'},
        state.command.length ?
          h('div', {id: 'command', class: state.command}, `${state.command}:`) : null,
        h('input', {
          id: 'input',
          type: 'text',
          placeholder:
            state.command.length && Commands.COMMANDS[state.command].info || 'Type "/" for more options',
          value: state.query,
          onInput: this.onInput,
          onBlur: this.refocus,
          onKeyDown: this.onKeyDown,
        }),
      ),
      state.suggestions.map((node, index) =>
        h(Suggestion, {
          node,
          index,
          selected: state.selectedIndex === index,
          onHover: this.onSuggestionHover,
          onClick: this.onSuggestionClick,
        })),
    );
  }
}
