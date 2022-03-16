import React from 'react';
import { getPicPlayers } from "../api.js";
import { Link } from "react-router-dom";
import './modal.css';

// 子コンポーネント（モーダル）
export class NtModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editors: [],
      points: [],
      score: 0,
    };
  }
  
  componentDidUpdate = (prevProps) => {
    if (this.props.content !== prevProps.content){
      console.log(this.props.content);
      this.getPlayer();
    }
    else{
      console.log('there is no update');
    }
  }

  getPlayer = async() => {
    if(this.props.content == null){
      console.log('-');
    }
    else{
      await getPicPlayers(this.props.content.id).then((data) => {
        console.log(data);
      });
    }
  }
  
  render(){
    return(
      <>
        {this.props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" className='overlay'>
          <div id="modalcontents" className="modalcontents" onClick={(event)=>{event.stopPropagation()}}>
            <p>testNT</p>
          </div>
        </div>
        ) : (
          <></>// showFlagがfalseの場合はModalは表示しない)
        )}
      </>
    );
  }
}