import React from 'react';
import { DateTime } from 'luxon';
import '../style.css';

const Preview = ({searchResult, setSearchResults, setFeaturedResult}) => {

    console.log(searchResult);

    const {linksList, tagsList} = searchResult;
    
    return <aside id="preview">
        <section className="results">
           {linksList &&
               linksList.map((link)=>{
                  return ( <div 
                   key={link.id}
                   className="object-preview"
                   onClick={(event)=>{
                    event.preventDefault()
                    setFeaturedResult(link)
                   }}>
                      {
                          link.url ? <h3>{link.url}</h3> : <h3>MISSING INFO</h3>

                      }
                      {
                          link.comment && <h3>{link.comment}</h3> 
                      }
                    
                      {
                          link.dateShared && <h3>Shared: {DateTime.fromISO(link.dateShared).toLocaleString()}</h3>
                      }
                   </div>
                  )
               })
           }
           {tagsList &&
                tagsList.map((tag)=>{
                  return ( <div 
                   key={tag.id}
                   className="object-preview"
                   onClick={(event)=>{
                    event.preventDefault()
                    setFeaturedResult(tag)
                   }}>
                      {
                          tag.tagName ? <h2>{tag.tagName }</h2> : <h3>MISSING INFO</h3>

                      }
                   </div>
                  )
               })
           }

        </section>
    </aside>
    

}
export default Preview;