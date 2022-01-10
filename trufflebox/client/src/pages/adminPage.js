import logo from '../logo.svg';
import '../components/modal.css';
import React, { Component } from 'react';
import { getTeamPlayers } from '../api.js';

export class AdminOpt extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      itemList: [],
      ptcp: [],
      origin: [],
      item: '',
      accounts: this.props.accounts,
      contract: this.props.contract
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  getTeamAddr = async(_teamId) => {
    const history = await getTeamPlayers(_teamId);
    //this.setState({itemList: history});
    console.log('h ', history);
    let copyPtcp = [...this.state.ptcp];
    let copyOrigin = [...this.state.origin];
    this.despenser(_teamId, history, copyPtcp, copyOrigin);
  }
  despenser = (_teamId, _history, _copyPtcp, _copyOrigin) => {
    const ptcpLen = _history.length;
    let iter = 1;
    _copyOrigin.push(_history[0]);
    this.setState({origin: _copyOrigin});
    while(iter != ptcpLen){
      _copyPtcp.push(_history[iter]);
      ++iter;
    }
    this.setState({ptcp: _copyPtcp});
    //console.log('v ', this.state.ptcp);
    this.setBlockChain(_teamId);
  }
  setBlockChain = async(_teamId) => {
    console.log('v ', _teamId, this.state.ptcp, this.state.origin);
    await this.state.contract.methods.putBlock(
      _teamId,
      this.state.ptcp,
      this.state.origin
    ).send({ from: this.state.accounts[0] });
  }

  handleFormSubmit = (evt) => {
    alert('was submitted: ' + this.state.item);
    this.getTeamAddr(this.state.item);
    evt.preventDefault();
  }
  handleOnChange = (evt) => {
    this.setState({item: evt.target.value});
  }

  render(){
    return(
      <div className="App-header">
        <header >
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <p>PROTO : MINT</p>
        <form onSubmit={this.handleFormSubmit}>
            <input name="name" className="input" placeholder='teamId' 
              value={this.state.item} onChange={this.handleOnChange}/>
            <p></p><button type="submit" className="button is-warning">
            chain
            </button>
        </form>
      </div>
    )
  }
}