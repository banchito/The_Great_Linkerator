import React, { useState, useEffect } from 'react';
import {Search, Preview, Feature} from '../components'
//import {fetchAllLinks} from '../api';

const App = () => {
  // const [message, setMessage] = useState('');
  const [searchResult, setSearchResults] = useState({linksList:[], tagsList:[]});
  const [featuredResult, setFeaturedResult]   = useState(null)
  const [linksList, setLinkList]          = useState([]);
  const [tagsList, setTagsList]           = useState([]);
  const [linkTag, setLinkTag] =  useState('any');


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
    <div className="app">
      <Search linkTag={linkTag} setLinkTag={setLinkTag} setTagsList={setTagsList} tagsList={tagsList} linksList={linksList} setLinkList={setLinkList} setSearchResults={setSearchResults}/>
      <Preview searchResult={searchResult} setSearchResults={setSearchResults} setFeaturedResult={setFeaturedResult}/>
      <Feature linkTag={linkTag} setTagsList={setTagsList} linkList={linksList} setLinkList={setLinkList} featuredResult={featuredResult} setSearchResults={setSearchResults}/>
    </div>
  );
}

export default App;