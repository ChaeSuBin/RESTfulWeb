import '../App.css';
import React, { useEffect,useCallback,useState } from "react";
import { Link } from 'react-router-dom';

export const Nav = ({contract, accounts}) => {
  const[isModalOpen,setIsModalOpen]=useState(false)

   const closeModal= useCallback(() =>{
     setIsModalOpen(false)
     document.removeEventListener('click',closeModal)
   },[])

   useEffect(()=>{
     return ()=>{
       document.removeEventListener('click',closeModal)
     }
   },[closeModal])


   function openModal(event){
     setIsModalOpen(true)
     document.addEventListener('click',closeModal)
     event.stopPropagation()
   }

  return (
    <div>
      <header>
        navigation
      </header>
      <Link to="/"><button>home</button></Link>
      <Link to="/search"><button>search</button></Link>
      <Link to="/myinfo"><button>myPage</button></Link>

      <button onClick={(event)=>{openModal(event)}}>create</button>
      {isModalOpen? <Modal onClick={(event)=>{closeModal(event)}}/> :""}
    </div>
  );
}


function Modal(props){

  return(
    <div id="modal" className="modal" onClick={(event)=>{event.stopPropagation()}}>
      <section>
        <p><li>select your Idea case</li></p>
        <Link to="/ntwave"><button>NFT</button></Link>
        
        <Link to={'/create/' + 'cycle'}><button>Cycle</button></Link>
        <Link to={'/create/' + 'rapid'}><button>Rapid</button></Link>
      </section>
      <button onClick={props.onClick}>cancle</button>
    </div>
  )
}