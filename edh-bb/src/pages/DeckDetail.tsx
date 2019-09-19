import React from "react"
import firebase from "./../index"


class DisplayDeckDetails extends React.Component{ 
  


  async getDeckName(deckID:string){
    const snapshot = await firebase.firestore().collection('deck').doc(deckID).get()
    const docSnap = snapshot.data()
    console.log(docSnap!.deckName)
    renderName(docSnap!.deckName)
    
  }




  



  async displayDeckDescription(deckID:string){
    const snapshot = await firebase.firestore().collection('deck').doc(deckID).get()
    const docSnap = snapshot.data()
    console.log(docSnap!.deckDescription)
    renderDescription(docSnap!.deckDescription)
  }
    
 
}

function renderName(name:string){
  const nameRender = document.querySelector('#name');
  let input = document.createElement('input');
  input.value = name;

  nameRender!.appendChild(input)

}

function renderDescription(name:string){
  const nameRender = document.querySelector('#desc');
  let input = document.createElement('input');
  input.value = name;

  nameRender!.appendChild(input)

}

const DeckDetail: React.FC = () => {

  const getDeckInstance = new DisplayDeckDetails(""); 

  
  const docRef = getDeckInstance.getDeckName("FxoenBqC6m9DlwsKvROe");
  getDeckInstance.displayDeckDescription("FxoenBqC6m9DlwsKvROe");

  

        
    
  
  

    

  return (
    
    <div>
      <h1>[DeckDetail]</h1>
        <ul id="name"></ul>
        <ul id="desc"></ul>
    </div>
      
  )
  

}

export default DeckDetail;
