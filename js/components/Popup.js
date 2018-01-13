'use strict';

// Props: none
// State:
//  - route: 'launch' | 'edit' | 'delete'
//  - activeNode: ?chrome.bookmarks.BookmarkTreeNode
class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      route: 'launch',
      activeNode: null,
    };
  }

  render(props, state) {
    switch (state.route) {
      default:
      return h(Launcher);
    }
  }
}
