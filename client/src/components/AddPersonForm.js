import React from 'react'

const AddPersonForm = (
    {
        addNewPerson,
        newName,
        handleNameChange,
        newNumber,
        handleNumberChange,
    }
    ) => (
    
    <form onSubmit={addNewPerson}>
        <div>
            Name: 
            <input 
                type="text"
                value={newName}
                onChange={handleNameChange} 
                placeholder="Type name here..."
            />
        </div>
        <div>
            Number: 
            <input 
                type="text"
                value={newNumber}
                onChange={handleNumberChange}
                placeholder="Type phone number here..."
            />
        </div>
        <div>
            <button type="submit">
                    add
            </button>
        </div>
    </form>
)

export default AddPersonForm
