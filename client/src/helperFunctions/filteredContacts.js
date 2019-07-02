import React from 'react'
import Person from '../components/Person'
import isPhonebookMatch from './isPhonebookMatch'
import uuid from 'uuid'

const FilteredContacts = ({persons, searchQuery, handlePersonDeletion}) => {
    return(
        persons.map((person) => {
            if (searchQuery) {
                if (isPhonebookMatch(person.name, searchQuery)) {
                    return(
                        <Person 
                            key={person.name}
                            person={person}
                            handlePersonDeletion={() => handlePersonDeletion(person)}
                        />
                    )
                } else {
                        return undefined
                }
            }
            else {
            // no search in progress
                return(
                    < Person 
                        key={uuid()}
                        person={person}
                        handlePersonDeletion= {() => handlePersonDeletion(person)} 
                    />)
            }
        })
    )
}
    
export default FilteredContacts