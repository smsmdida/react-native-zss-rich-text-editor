import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {ListView, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {actions} from './const';

const defaultActions = [
  actions.setBold,
  actions.setItalic,
  actions.insertBulletsList,
  actions.insertOrderedList,
  actions.setUnderline,
  actions.heading1,
  actions.heading2,
  actions.heading3,
  actions.heading4,
  actions.heading5,
  actions.heading6,
  actions.setParagraph,
  actions.removeFormat,
  actions.alignLeft,
  actions.alignCenter,
  actions.alignRight,
  actions.alignFull,
  actions.setSubscript,
  actions.setSuperscript,
  actions.setStrikethrough,
  actions.setHR,
  actions.setIndent,
  actions.setOutdent,
];

function getDefaultIcon() {
  const texts = {};
  texts[actions.setBold] = require('../img/ZSSbold.png');
  texts[actions.setItalic] = require('../img/ZSSitalic.png');
  texts[actions.insertBulletsList] = require('../img/ZSSunorderedlist.png');
  texts[actions.insertOrderedList] = require('../img/ZSSorderedlist.png');
  texts[actions.setUnderline] = require('../img/ZSSunderline.png');
  texts[actions.heading1] = require('../img/ZSSh1.png');
  texts[actions.heading2] = require('../img/ZSSh2.png');
  texts[actions.heading3] = require('../img/ZSSh3.png');
  texts[actions.heading4] = require('../img/ZSSh4.png');
  texts[actions.heading5] = require('../img/ZSSh5.png');
  texts[actions.heading6] = require('../img/ZSSh6.png');
  texts[actions.setParagraph] = require('../img/ZSSparagraph.png');
  texts[actions.removeFormat] = require('../img/ZSSclearstyle.png');
  texts[actions.alignLeft] = require('../img/ZSSleftjustify.png');
  texts[actions.alignCenter] = require('../img/ZSScenterjustify.png');
  texts[actions.alignRight] = require('../img/ZSSrightjustify.png');
  texts[actions.alignFull] = require('../img/ZSSforcejustify.png');
  texts[actions.setSubscript] = require('../img/ZSSsubscript.png');
  texts[actions.setSuperscript] = require('../img/ZSSsuperscript.png');
  texts[actions.setStrikethrough] = require('../img/ZSSstrikethrough.png');
  texts[actions.setHR] = require('../img/ZSShorizontalrule.png');
  texts[actions.setIndent] = require('../img/ZSSindent.png');
  texts[actions.setOutdent] = require('../img/ZSSoutdent.png');
  return texts;
}


export default class RichTextToolbar extends Component {

  static propTypes = {
    getEditor: PropTypes.func.isRequired,
    actions: PropTypes.array,
    onPressAddLink: PropTypes.func,
    onPressAddImage: PropTypes.func,
    selectedButtonStyle: PropTypes.object,
    iconTint: PropTypes.any,
    selectedIconTint: PropTypes.any,
    unselectedButtonStyle: PropTypes.object,
    renderAction: PropTypes.func,
    iconMap: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const actions = this.props.actions ? this.props.actions : defaultActions;
    this.state = {
      editor: undefined,
      selectedItems: [],
      actions,
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.getRows(actions, []))
    };
  }

  componentWillReceiveProps(newProps) {
    const actions = newProps.actions ? newProps.actions : defaultActions;
    this.setState({
      actions,
      ds: this.state.ds.cloneWithRows(this.getRows(actions, this.state.selectedItems))
    });
  }

  getRows(actions, selectedItems) {
    return actions.map((action) => {return {action, selected: selectedItems.includes(action)};});
  }

  componentDidMount() {
    const editor = this.props.getEditor();
    if (!editor) {
      throw new Error('Toolbar has no editor!');
    } else {
      editor.registerToolbar((selectedItems) => this.setSelectedItems(selectedItems));
      this.setState({editor});
    }
  }

  setSelectedItems(selectedItems) {
    if (selectedItems !== this.state.selectedItems) {
      this.setState({
        selectedItems,
        ds: this.state.ds.cloneWithRows(this.getRows(this.state.actions, selectedItems))
      });
    }
  }

  _getButtonSelectedStyle() {
    return this.props.selectedButtonStyle ? this.props.selectedButtonStyle : styles.defaultSelectedButton;
  }

  _getButtonUnselectedStyle() {
    return this.props.unselectedButtonStyle ? this.props.unselectedButtonStyle : styles.defaultUnselectedButton;
  }

  _getButtonIcon(action) {
    if (this.props.iconMap && this.props.iconMap[action]) {
      return this.props.iconMap[action];
    } else if (getDefaultIcon()[action]){
      return getDefaultIcon()[action];
    } else {
      return undefined;
    }
  }

  _defaultRenderAction(action, selected) {
    const icon = this._getButtonIcon(action);
    return (
      <TouchableOpacity
          key={action}
          style={[
            {height: 50, width: 50, justifyContent: 'center'},
            selected ? this._getButtonSelectedStyle() : this._getButtonUnselectedStyle()
          ]}
          onPress={() => this._onPress(action)}
      >
        {icon ? <Image source={icon} style={{tintColor: selected ? this.props.selectedIconTint : this.props.iconTint}}/> : null}
      </TouchableOpacity>
    );
  }

  _renderAction(action, selected) {
    return this.props.renderAction ?
        this.props.renderAction(action, selected) :
        this._defaultRenderAction(action, selected);
  }

  render() {
    return (
      <View
          style={[{height: 50, backgroundColor: '#D3D3D3', alignItems: 'center'}, this.props.style]}
      >
        <ListView
            horizontal
            contentContainerStyle={{flexDirection: 'row'}}
            dataSource={this.state.ds}
            renderRow= {(row) => this._renderAction(row.action, row.selected)}
        />
      </View>
    );
  }

  _onPress(action) {
    switch(action) {
      case actions.setBold:
      case actions.setItalic:
      case actions.insertBulletsList:
      case actions.insertOrderedList:
      case actions.setUnderline:
      case actions.heading1:
      case actions.heading2:
      case actions.heading3:
      case actions.heading4:
      case actions.heading5:
      case actions.heading6:
      case actions.setParagraph:
      case actions.removeFormat:
      case actions.alignLeft:
      case actions.alignCenter:
      case actions.alignRight:
      case actions.alignFull:
      case actions.setSubscript:
      case actions.setSuperscript:
      case actions.setStrikethrough:
      case actions.setHR:
      case actions.setIndent:
      case actions.setOutdent:
        this.state.editor._sendAction(action);
        break;
      case actions.insertLink:
        this.state.editor.prepareInsert();
        if(this.props.onPressAddLink) {
          this.props.onPressAddLink();
        } else {
          this.state.editor.getSelectedText().then(selectedText => {
            this.state.editor.showLinkDialog(selectedText);
          });
        }
        break;
      case actions.insertImage:
        this.state.editor.prepareInsert();
        if(this.props.onPressAddImage) {
          this.props.onPressAddImage();
        }
        break;
        break;
    }
  }
}

const styles = StyleSheet.create({
  defaultSelectedButton: {
    backgroundColor: 'red'
  },
  defaultUnselectedButton: {}
});