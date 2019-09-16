export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject, //get fields of old object
        ...updatedProperties //replace fields in old object with new values

    }
}