import React from 'react'

const Person = ({ person, handlePersonDeletion }) => {
    return(
        <div>
            <li className="person" key={person.name}> 
                {person.name} : {person.number} 
            </li>
            <button onClick={handlePersonDeletion}>
                    Delete Contact
            </button>
        </div>
    )

}

export default Person