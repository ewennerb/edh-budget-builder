import React,{ Component } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import firebase from "firebase/app"


class DisplayDeckDetails extends Component{
  ID: string;
  constructor(props: any) {
    super(props);
    this.state = {value: ''};
    this.ID = ""

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async getDeckName(deckID:string){
    console.log(deckID)
    
    const snapshot = await firebase.firestore().collection('deck').doc(deckID).get()
    const docSnap = snapshot.data()
    console.log(docSnap!.deckName)
    renderName(docSnap!.deckName)
    
  }



  async displayDeckDescription(deckID:string){
    this.ID = deckID
    const snapshot = await firebase.firestore().collection('deck').doc(deckID).get()
    const docSnap = snapshot.data()
    console.log(docSnap!.deckDescription)
    renderDescription(docSnap!.deckDescription)
  }

  

  handleSubmit(event:any) {
    event.preventDefault();
    var ID = this.ID
    firebase.firestore().collection('deck').doc(ID).update({
        deckName:event.target.name.value,
        deckDescription:event.target.desc.value,
        deck:[1,2,4,5]    
    })
    .then(function() {
      alert("Deck updated: "+ID);
  })
    alert('values updated in database: name=' + event.target.name.value +', description='+ event.target.desc.value);
    
  }

  render() {
    const classes = useStyles();




  return (
    <form
    onSubmit={this.handleSubmit}
    className="innerForm">
        <h1>[CreateDeck]</h1>
      <TextField
        required
        id="name"
        label="Required"
        defaultValue="Deck Name"
        className={classes.textField}
        margin="normal"
       
      />
        <br></br>
      <TextField
        id="desc"
        placeholder="Deck Description"
        multiline
        rowsMax="4"
  
        className={classes.textField}
        margin="normal"
      />
      <br></br>
      <br></br>
      <input type="submit"/>
  </form>

      
    
    
    
  );
  }
}

function renderName(name:string){
  (document.getElementById("name")as HTMLInputElement).value = name;
}

function renderDescription(desc:string){
  (document.getElementById("desc")as HTMLInputElement).value = desc;

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 1000,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
  }),
);


interface State {
    deckName: string;
    deckDescription: string;
    cards: string;
}

const DeckDetail: React.FC = () => {

  const getDeckInstance = new DisplayDeckDetails(""); 

  console.log(window.location.href)
  const link = window.location.href.split("/");
  const deckID=link[link.length-1]

  getDeckInstance.getDeckName(deckID);
  getDeckInstance.displayDeckDescription(deckID);

  

        
    
  
  

    

  return (
    
    getDeckInstance.render()
      
  )
  

}

export default DeckDetail;