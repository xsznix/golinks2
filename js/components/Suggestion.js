'use strict';

// Props:
//  - node: chrome.bookmarks.BookmarkTreeNode
//  - index: number
//  - selected: boolean
//  - onHover: number => void
//  - onClick: (number, Event) => void
class Suggestion extends Component {
  constructor(props) {
    super(props);
    this.onHover = this.onHover.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onHover() {
    this.props.onHover(this.props.index);
  }

  onClick(event) {
    this.props.onClick(this.props.index, event);
  }

  render(props) {
    if (props.node.specialType && props.node.specialType === 'command') {
      return h('div', {
          class: `Suggestion-root${props.selected ? ' selected' : ''}`,
          onMouseMove: this.onHover,
          onClick: this.onClick,
        },
        h('div', {class: 'Suggestion-text-wrapper'},
          h('div', {class: 'Suggestion-title'}, `/${props.node.title}`),
          h('div', {class: 'Suggestion-description'}, props.node.description),
        ),
      );
    }

    return h('div', {
        class: `Suggestion-root${props.selected ? ' selected' : ''}`,
        title: `${props.node.title}\n${props.node.url}`,
        onMouseMove: this.onHover,
        onClick: this.onClick,
      },
      h('div', {class: 'Suggestion-favicon-wrapper'},
        h('img', {class: 'Suggestion-favicon', src: `chrome://favicon/size/24@2x/${props.node.url}`}),
      ),
      h('div', {class: 'Suggestion-text-wrapper'},
        h('div', {class: 'Suggestion-title'}, props.node.title),
        h('div', {class: 'Suggestion-url'}, props.node.url),
      ),
    );
  }
}
