import React from 'react'
import { Formik, Field, Form} from 'formik'
import {
    Checkbox,
    TextField,
    FormControlLabel,
    Button,
} from '@material-ui/core';


// const cardTypes = [
//     "Artifact",
//     "Conspiracy",
//     "Creature",
//     "Enchantment",
//     "Instant",
//     "Land",
//     "Phenomenon",
//     "Plane",
//     "Planeswalker",
//     "Scheme",
//     "Sorcery",
//     "Tribal",
//     "Vanguard"
// ];
//
// const superTypes = [
//     "Basic",
//     "Legendary",
//     "Ongoing",
//     "Snow",
//     "World"
// ];


class SearchBar extends React.Component {
    //@ts-ignore
    handleSubmit(values){
        //@ts-ignore
        this.props.searchQuery(values);
    }


    render() {
        return(
            <div>
                <h1>Card Search</h1>
                <Formik
                    initialValues={{
                        cardName: '',
                        colors: [],
                        type: "",
                        subtype: "",
                        sortBy: "",
                    }}
                    onSubmit={async values => {
                        await this.handleSubmit(values)
                    }}
                >
                    {({isSubmitting, handleChange, handleBlur, values}) => (
                        <Form>
                            <Field
                                name="cardName"
                                type="text"
                                placeholder="Search by Card Name"
                            />
                            <br />
                            <FormControlLabel
                                control={
                                    <Field type="checkbox" name="colors" value="R" label="Red" component={Checkbox}/>
                                }
                                label="Red"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                control={
                                    <Field type="checkbox" name="colors" value="G" label="Green" component={Checkbox}/>
                                }
                                label="Green"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                control={
                                    <Field type="checkbox" name="colors" value="U" label="Blue" component={Checkbox}/>
                                }
                                label="Blue"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                control={
                                    <Field type="checkbox" name="colors" value="B" label="Black" component={Checkbox}/>
                                }
                                label="Black"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                control={
                                    <Field type="checkbox" name="colors" value="W" label="White" component={Checkbox}/>
                                }
                                label="White"
                                labelPlacement="top"
                            />

                            <Button type="submit" disabled={isSubmitting}>Search</Button>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    };
}

export default SearchBar;