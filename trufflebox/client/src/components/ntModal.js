import React from 'react';
import { getPicPlayers } from "../api.js";
import { readImg } from './readImgCpnt.js';
import './modal.css';

// 子コンポーネント（モーダル）
export class NtModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkValue: null,
      editors: null,
      imagePreviewUrl: null,
      score: 0,
      account: this.props.account,
    };
  }
  componentDidUpdate = async(prevProps) => {
    if (this.props.content !== prevProps.content){
      //console.log(this.props.content);
      this.getPlayer();
      this.runBlockchain(this.props.contract);
      this.handleFileReader(await readImg(this.props.content.title));
    }
    else{
      console.log('there is no update');
    }
  }

  handleFileReader = (_blob) => {
    const reader = new FileReader()
    const file = _blob
    console.log(_blob);
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      }); 
    }   
    reader.readAsDataURL(file);
  }

  runBlockchain = async(contract) => {
    console.log(this.props.contract);
    //this.setState({cont: this.props.contract})
    const response = await contract.methods.connectionTecs().call();
    this.setState({ checkValue: response });
  }

  getPlayer = async() => {
    if(this.props.content == null){
      console.log('-');
    }
    else{
      await getPicPlayers(this.props.content.id).then((data) => {
        //console.log(data); account
        this.setState({editors: data});
      });
    }
  }
  
  render(){
    return(
      <>
        {this.props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" className='overlay'>
          <div id="modalcontents" className="modalcontents" onClick={(event)=>{event.stopPropagation()}}>
          connection: <b>{this.state.checkValue}</b>
          <div><img src={this.state.imagePreviewUrl} /></div>
          <p style={{margin: 0}}> editor: </p>{this.state.editors}
          </div>
        </div>
        ) : (
          <></>// showFlagがfalseの場合はModalは表示しない)
        )}
      </>
    );
  }
}