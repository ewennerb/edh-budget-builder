import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByLabelText, getByText, getByTestId} from '@testing-library/react'
import SearchBar from './SearchBar';
import getSearchParams from './CardSearch'
import { SnackbarProvider } from 'notistack';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


Enzyme.configure({adapter: new Adapter()});
jest.mock("./SearchBar");
jest.mock('firebase/app');

const mockfirestore = new firebasemock.MockFirestore();
firebase.firestore = (() => mockfirestore) as any;

const testUser: firebase.User = { uid: "testUidAbc123" } as any;
const testDeck = {
    deck: [],
    deckDescription: "This is my test description",
    deckName: "Test Deck 1",
    ownerID: "testUidAbc123"
} as any;
firebase.firestore().collection("decks").add(testDeck);

const doRender = (user: firebase.User) => {
    const renderResult = render(<SnackbarProvider><SearchBar searchQuery={getSearchParams}/></SnackbarProvider>);
    // mockfirestore.flush();
    mockfirestore.autoFlush(0);
    return renderResult;
};

it('renders without crashing', async () => {
    const { container } = doRender(testUser);
    const name_field = container.querySelector("#name");
    const type_field = container.querySelector("#type");
    const color_w = container.querySelector("#white");
    const color_u = container.querySelector("#blue");
    const color_b = container.querySelector("#black");
    const color_r = container.querySelector("#red");
    const color_g = container.querySelector("#green");
    const color_c = container.querySelector("#colorless");
    const rar_c = container.querySelector("#common");
    const rar_u = container.querySelector("#uncommon");
    const rar_r = container.querySelector("#rare");
    const rar_m = container.querySelector("#mythic-rare");
    const price = container.querySelector("#price_1_value");
    const order = container.querySelector("#order");
    const searchButt = container.querySelector(".button-primary-large");

    expect(name_field).toBeDefined();
    expect(type_field).toBeDefined();
    expect(color_w).toBeDefined();
    expect(color_u).toBeDefined();
    expect(color_b).toBeDefined();
    expect(color_r).toBeDefined();
    expect(color_g).toBeDefined();
    expect(color_c).toBeDefined();
    expect(rar_c).toBeDefined();
    expect(rar_u).toBeDefined();
    expect(rar_r).toBeDefined();
    expect(rar_m).toBeDefined();
    expect(price).toBeDefined();
    expect(order).toBeDefined();
    expect(searchButt).toBeDefined();
});

