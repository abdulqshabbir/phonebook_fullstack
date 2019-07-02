import React from '../../node_modules/react'
import './Notification.css'

const Notification = ({ notification }) => {

    if (notification.type === 'NEW_PERSON') {
        return(
            <div className="notification add" >
                {`${notification.data.name} was just added!`}
            </div>
        )
    } else if (notification.type === 'DELETE_PERSON') {
        return(
            <div className="notification delete" >
                {`${notification.data.name} was just deleted.`}
            </div>
        )
    } else if (notification.type === 'UPDATE_PERSON') {
        return(
            <div className="notification update" >
                {`${notification.data.name}'s phone number was just updated to ${notification.data.number}.`}
            </div>
        )
    } else if (notification.type === 'PERSON_DOES_NOT_EXIST') {
        return(
            <div className="notification delete" >
                {`${notification.data.name} does not exist in the server.`}
            </div>
        )
    }
    return null
}
export default Notification