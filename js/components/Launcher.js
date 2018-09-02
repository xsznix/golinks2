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
    this.refocus = this.refocus.bind(this);
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
          this.input.setSelectionRange(newLength, newLength);
        });
        this.refreshSuggestions();
      }
      break;

      // Clear input
      case 'Escape':
      if (this.state.query.length) {
        event.preventDefault();
        this.setState({
          query: '',
          selectedIndex: 0,
        }, () => {
          this.input.setSelectionRange(0, 0);
        });
        this.refreshSuggestions();
      } else if (this.state.command.length) {
        event.preventDefault();
        this.setState({
          command: '',
          typedCommand: '',
          query: '',
          selectedIndex: 0,
        }, () => {
          this.input.setSelectionRange(0, 0);
        });
        this.refreshSuggestions();
      }
      break;

      // Change selection
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Tab':
      event.preventDefault();
      const moveDown = event.key === 'ArrowDown' || event.key === 'Tab' && !event.getModifierState('Shift');
      const delta = moveDown ? 1 : -1;
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
      this.executeMainAction(this.getDisposition(event));
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

  onSuggestionClick(index, event) {
    this.setState({
      selectedIndex: index,
    }, () => {
      this.executeMainAction(this.getDisposition(event));
    });
  }

  refocus() {
    // Don't try to refocus if we have been unmounted
    if (!this._disable) {
      this.input.focus();
    }
  }

  executeMainAction(disposition) {
    if (this.state.suggestions.length) {
      const selectedNode = this.state.suggestions[this.state.selectedIndex];
      switch (this.state.command) {
        case '':
        if (this.state.query[0] === '/') {
          if (selectedNode.title === 'list') {
            Executor.execList();
          } else if (selectedNode.title === '?') {
            Onboarding.show();
          } else {
            this.setState({
              command: selectedNode.title,
              typedCommand: selectedNode.title,
              query: '',
              selectedIndex: 0,
            }, () => {
              this.refreshSuggestions();
              document.getElementById('input').select();
            });
          }
        } else {
          Executor.execGolink(selectedNode, this.state.query, disposition);
        }
        break;

        case 'search':
        Executor.execChromeBookmark(selectedNode, disposition);
        break;

        case 'mark':
        // Don't let the user create duplicate names
        return;

        case 'copy':
        Executor.execCopy(selectedNode, this.state.query);
        break;

        case 'tab':
        Executor.execTab(selectedNode);
        break;

        case 'history':
        Executor.execHistory(selectedNode, disposition);
        break;

        case 'edit':
        this.props.onStartEdit(selectedNode, this.state);
        break;

        case 'delete':
        this.props.onStartDelete(selectedNode, this.state);
        break;
      }
    } else {
      switch (this.state.command) {
        case 'mark':
        Executor.execMark(this.state.query);
        break;

        case 'list':
        Executor.execList();
        break;

        case '?':
        Onboarding.show();
        break;
      }
    }
  }

  getDisposition(event) {
    if (event[USER_OS === 'mac' ? 'metaKey' : 'ctrlKey']) {
      if (event.shiftKey) {
        return 'newtab_hidden';
      } else {
        return 'newtab';
      }
    } else {
      if (event.shiftKey) {
        return 'newwin';
      } else {
        return 'sametab';
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
          this.input.select();
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
          h('div', {id: 'command', class: state.command === '?' ? 'help' : state.command}, `${state.command}:`) : null,
        h('input', {
          id: 'input',
          ref: el => {this.input = el},
          type: 'text',
          placeholder:
            state.command.length && Commands.COMMANDS[state.command].info || 'type "/" for more options',
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
