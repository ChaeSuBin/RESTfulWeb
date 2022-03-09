import logo from '../logo.svg';
import '../components/modal.css';
import React from 'react';
import { getTeamsCount, getIdeas } from '../api.js';
import ListItems from '../components/ItemsCpnt';
import { Modal } from'../components/cModalCpnt';

class ViewItems extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      itemList: [],
      item: null,
      cont: null,
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    //this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount = async () => {
    this.setState({
      itemList: await getIdeas()
    });
  }

  handleClick = (_searchItems) => {
    console.log('v ', _searchItems);
    this.setState({cont: _searchItems});
    this.setState({showModal: true});
  }

  modalClose = () => {
    this.setState({showModal: false});
    window.location.reload();
  }

  render(){
    return(
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>문서 {this.state.itemList.length}건이 검색됨</p>
          {this.state.itemList.map(searchItems => (
            <ListItems
              key={searchItems.title}
              title = {searchItems.title}
              description = {searchItems.description}
              onClick={() => this.handleClick(searchItems)}
            />
          ))}
          <Modal
            account={this.state.accounts[0]} contract={this.state.contract}
            showFlag={this.state.showModal} content = {this.state.cont}
            onClick={()=>{this.modalClose()}}
          />
        </header>
      </div>
    )
  }
}
export default ViewItems;