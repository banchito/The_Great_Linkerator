import React, {useEffect, useState} from 'react';
import '../style.css';

import { fetchAllLinks, fetchAllTags } from '../api';

const Search = ({setSearchResults})=>{
    const [linksList, setLinkList]          = useState([]);
    const [tagsList, setTagsList]           = useState([]);
    const [queryString, setQueryString]    = useState('');
    const [link, setLink] =  useState('any');
    const [tag, setTag] =  useState('any');


    useEffect(()=>{
        Promise.all([fetchAllLinks(),fetchAllTags()])
        .then(([links, tags])=>{
            setTagsList(tags);
            setLinkList(links);
        })
        .catch(error => {console.log(error);});
    }, [])

    return <form id="search" onSubmit={ async (event) => {
       
        event.preventDefault();
       
        try{
        //   const results = await fetchQueryResults({century, classification, queryString})
        //   setSearchResults(results)
        }catch(error){
          console.log(error)
        }
         
      }}>

    <fieldset>
        <label htmlFor="select-link">Link<span className="link-count">({ linksList.length })</span></label>
        <select name="link"
        id="select-classification"
        value={link}
        onChange={(event)=> setLink(event.target.value)}>
        <option value="any">Any</option>
        {
            linksList.map((link)=>{
                return(<option key={link.id} value={link.url}>{link.url}</option>)
            })
        }
        </select>
    </fieldset>
    <fieldset>
        <label htmlFor="select-tag">Tag<span className="century-count">({ tagsList.length })</span></label>
        <select
        name="tag"
        id="select-tag"
        value={tag}
        onChange={(event)=> setTag(event.target.value)}>
        <option value="any">Any</option>
        {
            tagsList.map((tag)=>{
                return(<option key={tag.id} value={tag.tagName}>{tag.tagName}</option>)
            })
        }
        </select>
    </fieldset>
    <button>SEARCH</button>
 </form>
        
        
        
        
        
        
        
        
        
       
       
       
       
       
       
       
       
       
        
    
}
export default Search;

