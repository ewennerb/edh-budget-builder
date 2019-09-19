import React from "react"
import firebase from "./../index"
import { string } from "prop-types"
import { wait } from "@testing-library/dom"
import { async, promised } from "q"

class DisplayDeckDetails extends React.Component<{},{name:string, description:string}> { 

  constructor () {
    super("")
    this.state = {name:"",
  description:""};

  }
  


  async getDeckName(deckID:string){
    const snapshot = await firebase.firestore().collection('deck').doc(deckID).get()
    const docSnap = snapshot.data()
    console.log(docSnap!.deckName)
    renderName(docSnap!.deckName)
    
  }




  



  displayDeckDescription(deckID:string){
    firebase.firestore().collection('deck').doc(deckID).delete()
    .then(function() {
      window.location.reload(false);
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }
    
 
}

function renderName(name:string){
  const nameRender = document.querySelector('#name');
  let input = document.createElement('span');
  input.textContent = name;

  nameRender!.appendChild(input)

}

const DeckDetail: React.FC = () => {

  const getDeckInstance = new DisplayDeckDetails(); 

  
  const docRef = getDeckInstance.getDeckName("FxoenBqC6m9DlwsKvROe");

  

        
    
  
  

    

  return (
    
    <div>
      <h1>[DeckDetail]</h1>
        <ul id="name"></ul>
        <ul id="desc"></ul>
    </div>
      
  )
  

}

export default DeckDetail;
