'use strict';

// Props: none
// State:
//  - route: 'launch' | 'edit' | 'delete'
//  - activeNode: ?chrome.bookmarks.BookmarkTreeNode
//  - savedState: Launcher state
class Popup extends Component {
  constructor(props) {
    super(props);
    this.onStartEdit = this.onStartEdit.bind(this);
    this.onStartDelete = this.onStartDelete.bind(this);
    this.onActionDone = this.onActionDone.bind(this);
    this.onActionCancel = this.onActionCancel.bind(this);
    this.state = {
      route: 'launch',
      activeNode: null,
      savedState: {},
    };
  }

  onStartEdit(activeNode, savedState) {
    this.setState({
      route: 'edit',
      activeNode,
      savedState,
    });
  }

  onStartDelete(activeNode, savedState) {
    this.setState({
      route: 'delete',
      activeNode,
      savedState,
    });
  }

  onActionDone() {
    close();
  }

  onActionCancel() {
    this.setState({
      route: 'launch',
      activeNode: null,
    });
  }

  render(props, state) {
    switch (state.route) {
      case 'edit':
      return h(Editor, {
        onDone: this.onActionDone,
        onCancel: this.onActionCancel,
        activeNode: state.activeNode,
      });

      case 'delete':
      return h(Deleter, {
        onDone: this.onActionDone,
        onCancel: this.onActionCancel,
        activeNode: state.activeNode,
      });

      case 'launch':
      default:
      return h(Launcher, {
        onStartEdit: this.onStartEdit,
        onStartDelete: this.onStartDelete,
        initialState: state.savedState,
      });
    }
  }
}
