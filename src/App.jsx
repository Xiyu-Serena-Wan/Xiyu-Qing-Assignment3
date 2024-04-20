import axios from 'axios'
import React, { useEffect, useState } from 'react'

// export const Context = React.createContext();

function App() {
  // const [userStatus, setUserStatus] = useState('out');

  const [usernameState, setUsernameState] = useState('')

  async function getRandomUsername() {
    console.log("Starting API call")
    const response = await axios.get('https://randomuser.me/api/')
    console.log(response)
    setUsernameState(response.data.results[0].name.first) 
    console.log("Ending API call")
  }

  useEffect(function() {
    console.log("App loaded")
    getRandomUsername();
    console.log("App finished loading")
  }, [])

  if(!usernameState) {
    return <div>
      Loading username...
    </div>
  }

  return (
    <div>
      Hello, World, {usernameState} !!!
    </div>
  )
}

export default App
