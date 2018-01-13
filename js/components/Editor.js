'use strict';

// Props:
//  - activeNode: chrome.bookmarks.BookmarkTreeNode
//  - onDone: () => void
//  - onCancel: () => void
// State:
//  - title: string
//  - url: string
class Editor extends Component {
  render(props, state) {
    return h('div', {class: 'Editor-root'}, 'this is an editor');
  }
}
