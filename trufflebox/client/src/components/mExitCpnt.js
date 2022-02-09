import React from 'react';
import { getIdeaPlayers, getPlayers, getIdeaPoints } from "../api.js";
import './modal.css';

// 子コンポーネント（モーダル）
class ExitCall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editors: [],
      points: [],
      score: 0,
    };
  }
  
  componentDidUpdate = (prevProps) => {
    //console.log(this.props);
    if (this.props.content !== prevProps.content){
      this.getPlayer();
    }
    else{
      console.log('there is no update');
    }
    //this.getPlayer();
  }
  
  getPlayer = async() => {
    if(this.props.content == null){
      console.log('-');
    }
    else{
      //console.log(props.content.origin);
      let ideaid = this.props.content.id;
      await getIdeaPoints(ideaid).then((data) => {
        let copyPoint = [...this.state.points];
        let tempScore = 0;
        for(let iter = 0; iter < data.length; ++iter){
          //console.log(data[iter]);
          copyPoint.push(data[iter]);
          this.setState({points: copyPoint});
          tempScore += data[iter];
        }
        this.setState({score: tempScore});
      });
      await getIdeaPlayers(ideaid).then((data) => {
        let copyEditors = [...this.state.editors];
        for(let iter = 0; iter < data.length; ++iter){
          //console.log(data[iter].playerId);
          this.innerSync(data[iter].playerId, copyEditors);
        }
      });
    }
  }
  
  innerSync = async(_playerId, _copyEditors) => {
    const p = await getPlayers(_playerId);
    _copyEditors.push(p.sub);
    this.setState({editors: _copyEditors});
    //console.log(this.state.editors);
  }
  
  joinIdea = () => {
    console.log('close');
  }
  
  render(){
    return(
      <>
        {this.props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" className='overlay'>
          <div id="modalcontents" className="modalcontents" onClick={(event)=>{event.stopPropagation()}}>
            <div>
              <p>{this.props.content.title}</p>
              <ul><div style={{fontSize: "15px"}}>이 아이디어에 아래의 참가자가 참가중</div>
                {this.state.editors.map((editor, index) => (
                  <li key={index}>
                    {editor} :-: {((this.state.points[index]/this.state.score)*100).toFixed(2)}%
                  </li>
                ))}
              </ul>
              <button onClick={this.props.onClick}>Block</button>
              <button onClick={this.props.onClick}>Close</button>
              <button onClick={this.props.onClick}>Download</button>
            </div>
          </div>
        </div>
        ) : (
          <></>// showFlagがfalseの場合はModalは表示しない)
        )}
      </>
    );
  }
}

export default ExitCall;