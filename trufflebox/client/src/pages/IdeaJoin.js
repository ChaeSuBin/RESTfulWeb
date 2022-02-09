import React, { useEffect, useState } from "react";
import { postHoldIdea } from "../api.js";
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { registChecker } from "../components/registCatch.js";

export const JoinIead = ({contract, accounts}) => {
  const location = useLocation(); // URL path や パラメータなど。JSのlocationと同じ
  console.log(location);
  const [partName, setName] = useState(queryString.parse(location.search));
  const docuName = partName.title;
  const hashCode = useState(queryString.parse(location.hash));
  const docuOrigin = hashCode[0].origin;
  //console.log('o: ', docuOrigin);
  
  async function handleFormSubmitUp(record) {
    await postHoldIdea(record);
        //console.log('v: ', record);
    console.log('v: ', record);
  }
  return(
    <>
      <p>PROTO : JOIN</p>
      <div className="box">
      <p>join idea</p>
      <IdeaForm onSubmit={handleFormSubmitUp} docuName={docuName} docuOri={docuOrigin} useraddr={accounts}/>
      </div>
    </>
  )
}

function IdeaForm({onSubmit, docuName, docuOri, useraddr}) {
  const [address, setAddr] = useState('');
  const [playerid , setId] = useState();
  const name = docuName;
  //console.log('v: ', docuOri);
  
  useEffect(()=>{
    //const web3 = await getWeb3();
    //const accounts = await web3.eth.getAccounts();
    setAddr(useraddr[0]);
    innerSync();
  },[]);

  const innerSync = async() => {
    setId(await registChecker(useraddr[0]));
  }
  
  async function handleFormSubmit(evt) {
      evt.preventDefault();
      if (onSubmit) {
          const record = {
            hash: evt.target.elements.docuhash.value,
            name: evt.target.elements.docuname.value,
            desc: evt.target.elements.docudesc.value,
            username: evt.target.elements.name.value,
            useraddr: evt.target.elements.addr.value,
            putstake: evt.target.elements.stake.value,
            origin: docuOri,
            userid: playerid,
          };
          evt.target.elements.docuhash.value ='';
          evt.target.elements.docuname.value ='';
          evt.target.elements.docudesc.value ='';
          evt.target.elements.addr.value ='';
          evt.target.elements.name.value ='';
          onSubmit(record);
        }
      }

    return(
    <form onSubmit={handleFormSubmit}>
      <div className="field">
        <div className="control">
        addr:
        <input name="addr" className="input" placeholder='address' size='45'
          value={address} disabled="disabled"/>
        <p>your name: 
        <input name="name" className="input" placeholder='name' /></p>
        <label className="label">docu hash</label>
          <div className="control">
            <input name="docuhash" className="input" />
          </div>
          <label className="label">docu name</label>
          <div className="control">
            <input name="docuname" className="input"
              value={name} disabled="disabled" />
          </div>
          <label className="label">description</label>
          <div className="control">
            <textarea name="docudesc" rows='20' cols='70' className="input" />
          </div>
          <label className="label">require stake</label>
          <div className="control">
            <input name="stake" className="input" placeholder="0-100"/>
          </div>
        </div>
      </div>
      
      <div className="field">
        <div className="control">
          <button type="submit" className="button is-warning">
            ideaUpload
          </button>
        </div>
      </div>
    </form>
    )
}