import React, {useState, useEffect} from '../node_modules/react';
import ReactDOM from '../node_modules/react-dom';
import FilteredContacts from './helperFunctions/filteredContacts'
import AddPersonForm from './components/AddPersonForm';
import personHttp from './httpMethods/personHttpMethods';
import Notification from './components/Notification'; 
import './index.css'

const App = () => {
    //------------------------ APPLICATION STATE -------------------------//
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [persons, setPersons] = useState([])
    const [notification, setNotification] = useState({})
 
    //------------------------ SIDE EFFECT HOOKS-------------------------//
    useEffect(() => {
            personHttp
                .getAllPeople()
                .then(people => setPersons(people))
    }, [])
    //------------------------ EVENT HANDLERS ----------------------------//
    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handlePersonSearch = (event) => {
        setSearchQuery(event.target.value)
    }

    const handlePersonDeletion = (personToDelete) => {
        personHttp.deletePerson(personToDelete)
        setPersons(persons.filter(person => person.id !== personToDelete.id))
        handleNotificationUpdate(personToDelete, 'DELETE_PERSON')
    }

    const handleNotificationUpdate = (person, type) => {
        setNotification({
            data: {...person},
            type: type
        })
        setTimeout(() => setNotification({}), 5000)
    }

    const clearInputFields = () => {
        setNewName('')
        setNewNumber('')
    }

    const addNewPerson = (event) => {
        event.preventDefault()
        const MESSAGE = `${newName} is already in the phonebook!  Replace the old number with the new one?`
        
        const duplicatePerson = persons.filter(person => person.name === newName)

        if (duplicatePerson.length > 0) {
            const replaceContact = window.confirm(MESSAGE)
            const duplicate = duplicatePerson[0]
            
            const personToUpdate = {
                ...duplicate,
                number: newNumber
            }
            if (replaceContact) {
                console.log('person to update before PUT request', personToUpdate)
                // make http PUT request to update phone number
                personHttp
                    .updatePerson(personToUpdate)
                    .then(updatedPerson => {
                        console.log('updated person after PUT request', updatedPerson)
                        // make a copy of the new state with phone number updated
                        setPersons(
                            persons
                                .filter(person => person.id !== updatedPerson.id)
                                .concat(personToUpdate)
                        )
                        handleNotificationUpdate(personToUpdate, 'UPDATE_PERSON')
                        clearInputFields()
                    })
                    .catch(error => {
                        console.log(error)
                    })
            } else {
                clearInputFields()
                return
            }
        }
        else {
            const newPerson = {
                name: newName,
                number: newNumber
            }
            personHttp
                .createPerson(newPerson)
                .then(savedPerson => {
                    setPersons([
                        ...persons,
                        newPerson
                    ])
                    handleNotificationUpdate(newPerson, 'NEW_PERSON')
                    clearInputFields()
                })
                .catch(error => {
                    console.log('There was an error createing a new person: ', error)
                })
        }
    }
    
    return(
        <div>
            <h1>
                Phonebook App
            </h1>
            <Notification 
                notification={notification} 
            />
            <h2>
                Search for a Person
                <input 
                    type="text"
                    onChange={handlePersonSearch}
                    value={searchQuery}
                />
            </h2>
            <h2>Add a New Person</h2>
                < AddPersonForm 
                    addNewPerson={addNewPerson}
                    newName={newName}
                    handleNameChange={handleNameChange}
                    newNumber={newNumber}
                    handleNumberChange={handleNumberChange}
                />
            <h2>People...</h2>
            <ul>
                < FilteredContacts 
                    persons={persons} 
                    searchQuery={searchQuery} 
                    handlePersonDeletion={handlePersonDeletion}
                />
            </ul>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));