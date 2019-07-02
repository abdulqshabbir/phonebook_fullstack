import React from '../../node_modules/react'

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