const isPhonebookMatch = (name, searchQuery) => {
    name = name.toLowerCase()
    searchQuery = searchQuery.toLowerCase()

    for (let i = 0; i < searchQuery.length; i++) {
        if (searchQuery.charAt(i) === name.charAt(i)) {
            // corresponding characters match!
        } 
        else {
            // corresponding characters don't match!
            return false
        }
    }
    return true
}

export default isPhonebookMatch