import React,{ Component } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import firebase from "firebase/app"

import Button from '@material-ui/core/Button';

import { Link, LinkProps } from 'react-router-dom';

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref} {...props} />
));

export class DisplayDeckDetails extends Component{
  ID: string;
  deckName:string;
  deckDesc: string;
  ownerID: string;
  deck:Array<string>;
  constructor(props: any) {
    super(props);
    this.state = {value: ''};
    this.ID = "";
    this.deckName="";
    this.deckDesc="";
    this.ownerID="";
    this.deck=[];

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async getDeckName(deckID:string){

    const snapshot = await firebase.firestore().collection('deck').doc(deckID).get()
    const docSnap = snapshot.data()
    console.log(docSnap!.deckName)
    this.deckName=docSnap!.deckName;
    this.deckDesc= docSnap!.deckDescription;
    this.ownerID = docSnap!.ownerID;
    this.deck = docSnap!.deck
    renderName(docSnap!.deckName)
    
  }



  async displayDeckDescription(deckID:string){
    this.ID = deckID
    const snapshot = await firebase.firestore().collection('deck').doc(deckID).get()
    const docSnap = snapshot.data()
    console.log(docSnap!.deckDescription)
    renderDescription(docSnap!.deckDescription)
  }

  copyDeck(){
    firebase.firestore().collection('deck').add({

      deckName: this.deckName + "- copy",
      deckDescription: this.deckDesc,
      deck: this.deck,
      ownerID: this.ownerID
  
    })
      .then(function (deckRef) {
        console.log("Deck written with ID: " + deckRef.id);
      })

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
        <h1>[CreateDeck]
        &nbsp;&nbsp;
      <Button  variant='contained' color="primary" onClick={() => { this.copyDeck() }} component={AdapterLink} to="/deck-list">
        Create a Copy
      </Button>
        &nbsp;&nbsp;
      <Button  variant='contained' color="primary" onClick={() => { deleteDeck(this.ID) }} component={AdapterLink} to="/deck-list">
        Delete Deck
      </Button>
        </h1>
       
      <TextField
        required
        id="name"
        label="Required"
        defaultValue="Deck Name"
        margin="normal"
       
      />
        <br></br>
      <TextField
        id="desc"
        placeholder="Deck Description"
        multiline
        rowsMax="4"
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

export function deleteDeck(deckID:string){
  firebase.firestore().collection('deck').doc(deckID).delete()
  .then(function() {
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
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