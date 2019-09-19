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
    

  render(){

    return(
      <div>

      <h1>[DeckDetail]</h1>
        <input id="name"></input>
        <br></br>
        <input id="desc"></input>
      </div>

    )
  
  }
 
}

function renderName(name:string){
  (document.getElementById("name")as HTMLInputElement).value = name;
}

function renderDescription(desc:string){
  (document.getElementById("desc")as HTMLInputElement).value = desc;

}



const DeckDetail: React.FC = () => {

  const getDeckInstance = new DisplayDeckDetails(""); 

  
  const docRef = getDeckInstance.getDeckName("FxoenBqC6m9DlwsKvROe");
  getDeckInstance.displayDeckDescription("FxoenBqC6m9DlwsKvROe");

  

        
    
  
  

    

  return (
    
    getDeckInstance.render()
      
  )
  

}

export default DeckDetail;
