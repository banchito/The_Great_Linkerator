import React, { useState, useEffect } from 'react';
import {Search} from '../components'
//import {fetchAllLinks} from '../api';

const App = () => {
  // const [message, setMessage] = useState('');
  const [searchResult, setSearchResults] = useState();
  // useEffect(() => {
    // fetchAllLinks()
      // .then(response => {
        // setMessage(response.message);
      // })
      // .catch(error => {
        // setMessage(error.message);
      // });
  // },[]);

  return (
    <div className="App">
      <Search setSearchResults={setSearchResults}/>
    </div>
  );
}

export default App;