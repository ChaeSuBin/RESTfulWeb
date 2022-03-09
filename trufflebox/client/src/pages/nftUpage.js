import logo from '../logo.svg';
import '../App.css';
import React from "react";
import SimpleStorageContract from "../contracts/ThreItems.json";

export class Nftwave extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      checkValue: null,
      web3: this.props.web3, 
      accounts: this.props.accounts, 
      contract: null
    };
  };
  
  componentDidMount = async () => {
    try {
      // Get the contract instance.
      const networkId = await this.state.web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new this.state.web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
      this.setState({ contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  
  runExample = async () => {
    const { accounts, contract } = this.state;
    const response = await contract.methods.connectionTecs().call();
    this.setState({ checkValue: response });
    console.log('v: ', response);
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App-header">
        <header>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <h2>Smart Contract Connected</h2>
        <p>Truffle Box is ready.</p>
        The stored value is: <b>{this.state.checkValue}</b>
      </div>
    );
  }
}