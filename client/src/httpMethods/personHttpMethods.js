import axios from '../../node_modules/axios'
const URL = 'http://localhost:5000/api/persons'

const getAllPeople = () => {
    const request = axios.get(`${URL}`)
    return request.then(response => response.data)
}

const createPerson = (newPerson) => {
    const request = axios.post(`${URL}`, newPerson)
    return request.then(response => response.data)
}

const deletePerson = (personToDelete) => {
    const request = axios.delete(`${URL}/${personToDelete.id}`)
    return request.then(response => response.data)
}

const updatePerson = (personToUpdate) => {
    const request = axios.put(`${URL}/${personToUpdate.id}`, personToUpdate)
    return request.then(response => response.data)
}

export default {
    getAllPeople: getAllPeople,
    createPerson: createPerson,
    deletePerson: deletePerson,
    updatePerson: updatePerson
}