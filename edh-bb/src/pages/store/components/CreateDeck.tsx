import React, { Component } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import firebase from "../../../index"


export default class PostDeck extends Component {
  constructor(props: any) {
    super(props);
    this.state = { value: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
  }



  handleSubmit(event: any) {
    event.preventDefault();

    //Add check that deck contains non space chars
    let title: string = event.target.deckName.value;
    let hasNonSpaceChar: boolean = false;
    if (title.length > 100) {
      alert("Error: Your deck name must be shorter than 100 characters");
      return;
    }
    for (var char of title) {
      if (char != ' ') {
        hasNonSpaceChar = true;
      }
    }
    if (!hasNonSpaceChar) {
      alert("Error: Your deck must have at least one non-space character");
      return;
    }


    firebase.firestore().collection('deck').add({
      deckName: event.target.deckName.value,
      deckDescription: event.target.deckDescription.value,
      deck: [1, 2, 4, 5]
    })
      .then(function (deckRef) {
        alert("Deck written with ID: " + deckRef.id);
      })
    alert('values input into database: name=' + event.target.deckName.value + ', description=' + event.target.deckDescription.value);

  }

  render() {
    const classes = useStyles();
    const [values, setValues] = React.useState<State>({
      deckName: "test123",
      deckDescription: "test",
      cards: "test"
    });

    const handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [name]: event.target.value });
    };

    return (
      <form
        onSubmit={this.handleSubmit}
        className="innerForm">
        <h1>[CreateDeck]</h1>
        <TextField
          required
          id="deckName"
          label="Required"
          defaultValue="Deck Name"
          className={classes.textField}
          margin="normal"
          onChange={handleChange('deckName')}
        />
        <br></br>
        <TextField
          id="deckDescription"
          placeholder="Deck Description"
          multiline
          rowsMax="4"
          onChange={handleChange('deckDescription')}
          className={classes.textField}
          margin="normal"
        />
        <br></br>
        <br></br>
        <input type="submit" />
      </form>





    );
  }
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