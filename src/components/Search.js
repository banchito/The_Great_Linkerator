import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../style.css';

import { fetchAllLinks, fetchAllTags, createLinkFrontEnd } from '../api';

const ModalForm = ({show, handleChange, formButton, handleClose, handleSubmit}) =>{
    return(
        <div>
            <Modal show={show} onHide={handleClose}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                       <Modal.Title>Add Tag to Routine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Control type="text" name="url" placeholder="Enter url" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Control type="text" name="comment" placeholder="Enter comment" onChange={handleChange} />
                        </Form.Group>

                    </Modal.Body>  
                    <Modal.Footer>
                       <Button variant="secondary" type="button" onClick={() =>{handleClose()}}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit" onClick={() =>{handleClose()}}>
                        Create
                      </Button> 
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}


const Search = ({setSearchResults, linksList, tagsList, setTagsList, setLinkList, linkTag, setLinkTag})=>{
    const [show, setShow] = useState(false);
    const [newLink, setNewLink] = useState("")
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewLink((prevNewLink)=>{
            return{
                ...prevNewLink,
            [name]: value
        }})
    }

    const handleSubmit = async(event)=>{
        event.preventDefault();
        try {
            const linkCreated = await createLinkFrontEnd(newLink)
            setNewLink("")
            effect()
            console.log(linkCreated);
        } catch (error) {
            console.log(error);
        }
    }
    
    
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
            linkTag === "Tags" && setSearchResults({tagsList});
            linkTag === "Links" && setSearchResults({linksList})
        }catch(error){
          console.log(error)
        }
         
      }}>

    <fieldset>
    <label htmlFor="select-link">Links<span className="link-count">({ linksList.length})</span> or Tags<span className="link-count"> ({tagsList.length})</span></label>
        <select name="linkTag"
        id="select-classification"
        value={linkTag}
        onChange={(event)=> setLinkTag(event.target.value)}>
        <option value="Any">Any</option>
        <option value="Links">Links</option>
        <option value="Tags">Tags</option>
        
        </select>
    </fieldset>
    <button>SEARCH</button>
    <button onClick={()=>{handleShow()}}>Add New Link</button>
    <ModalForm show={show} handleClose={handleClose} handleChange={handleChange } handleSubmit={handleSubmit} />

 </form>
        
}
export default Search;

