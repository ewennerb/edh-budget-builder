import React from "react";
import firebase from "firebase/app";
import Button from '@material-ui/core/Button';
import { Link, LinkProps } from 'react-router-dom';
import Async, { IfPending, IfFulfilled } from "react-async";
import { withSnackbar, WithSnackbarProps } from "notistack";
//import { wait } from "@testing-library/dom";

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
    <Link innerRef={ref} {...props} />
));

class Favorites extends React.Component<{ user: firebase.User } & WithSnackbarProps> {

    favoritesRef: firebase.firestore.CollectionReference;
    favorites: any;
    queryRef: firebase.firestore.Query;
    loadPromise: () => Promise<firebase.firestore.QueryDocumentSnapshot[]>;

    constructor(props: Readonly<{ user: firebase.User } & WithSnackbarProps>) {
        super(props);
        this.favoritesRef = firebase.firestore().collection("users").doc(this.props.user.uid).collection('favorites');
        let favCards: any;
        firebase.firestore().collection("users").doc(this.props.user.uid).get().then(doc => {
            if (doc.exists) {
                favCards = doc.get("favorites");
                this.favorites = favCards;
            }
        });

        this.queryRef = this.favoritesRef.orderBy("key");
        this.loadPromise = async () => {
            try {
                const query = await this.queryRef.get();
                const data = this.favorites;
                return data;
            } catch (err) {
                this.props.enqueueSnackbar('Could not get favorites', { variant: 'error' });
                console.error("Error retrieving favorites: ", err);
                throw err;
            }
        }
    }

    render() {
        return (
            <Async promiseFn={this.loadPromise}>
                {state =>
                    <>
                        <IfPending state={state}>
                            <h1>Retrieving favorites...</h1>
                        </IfPending>
                        <IfFulfilled state={state}>
                            {favorites => {
                                if (typeof (favorites) === "undefined") {
                                    return (
                                        <div>
                                            <h1>Favorite Cards</h1>
                                            <h3>You have no favorite cards.</h3>
                                            <Button variant='contained' component={AdapterLink} to='/search'>
                                                Search For Cards
                                        </Button>
                                        </div>
                                    )
                                }
                                if (favorites.length === 0) {
                                    return (
                                        <div>
                                            <h1>Favorite Cards</h1>
                                            <h3>You have no favorite cards.</h3>
                                            <Button variant='contained' component={AdapterLink} to='/search'>
                                                Search For Cards
                                            </Button>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <>
                                            <h1>Favorite Cards</h1>
                                            <div>
                                                <ul>
                                                    {
                                                        favorites.map((index) => {
                                                            return <li><h3>{index}</h3></li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </>
                                    )
                                }
                            }}
                        </IfFulfilled>
                    </>
                }
            </Async>
        )
    }

}

export default withSnackbar(Favorites);