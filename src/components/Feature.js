import React, {useEffect, useState} from 'react';
import '../style.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import {createTagFrontEnd, addTagToLinkFrontEnd, fetchAllLinks, fetchAllTags, addClickCountFrontEnd, deleteLinkFrontEnd} from '../api'



const ModalForm = ({show, handleChange, handleClose, handleSubmit}) =>{
    return(
        <div>
            <Modal show={show} onHide={handleClose}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                       <Modal.Title>Add Tag to Routine</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Control type="text" name="tagName" placeholder="Enter tag name" onChange={handleChange} />
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

const Feature = ({featuredResult, setTagsList, setLinkList, linkList, linkTag}) =>{

    const [show, setShow] = useState(false);
    const [newTag, setNewTag] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(()=>{
        const getAndSetLinksAndTags = async() =>{
            const allLinks = await fetchAllLinks()
            const allTags  = await fetchAllTags()

            setLinkList(allLinks);
            setTagsList(allTags)
        };
        getAndSetLinksAndTags()
    },[])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewTag((prevNewTag)=>{
            return{
                ...prevNewTag,
            [name]: value
        }})
    }

    const handleDelete = async()=>{
        try {
            console.log(featuredResult.id)
            await deleteLinkFrontEnd(featuredResult.id)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        try {
            const [tagCreated] = await createTagFrontEnd(newTag)
            
            setNewTag("");

            await addTagToLinkFrontEnd(featuredResult.id, tagCreated.id)
           
            await Promise.all([fetchAllLinks(),fetchAllTags()])
            .then(([links, tags])=>{
                setTagsList(tags);
                setLinkList(links);
            })

        } catch (error) {
            console.log(error);

        }
    }

    const updateLink = async(id, url, comment, clickCount  ) => {
        const response = await addClickCountFrontEnd(id, url, comment, clickCount);

        if(response){
            const newLinksList = [...linkList].map((link)=>{
                link.id === id && link.clickCount++;
                return link 
            })
            setLinkList(newLinksList)
        }
    };

    if(!featuredResult) return <main id="feature"></main>
    const {id, url, clickCount, tags, comment,  tagName} = featuredResult
    return (
        <main id="feature">
            <div className="object-feature">
                <header>
                    <h3><a onClick={()=>{updateLink(id, url, comment, clickCount)}} href={url} target="blank">{url}</a></h3>
                   {  <h4>clicked: {clickCount} times.</h4>}
                </header>   { (linkTag === "Links") &&
                                <Card border="info" style={{ width: '100%' }} bg={'light'}>
                                    <Card.Header>{  <h2 className="title">Tags: </h2>}</Card.Header>
                                            {
                                                tags && (
                                                <>
                                                <section className="content"> 
                                                <Card.Body>
                                                {
                                                    tags.map((tag)=>{ return  <Card.Text key={tag.id} className="content" >{tag.tagName}</Card.Text> })
                                                }
                                                <Button style={{ width: '10rem', margin: '4px' }} onClick={()=>{handleShow()}}>Add tag</Button>
                                                <Button style={{ width: '10rem', margin: '4px'  }} onClick={()=>{handleDelete()}}>Delete</Button>
                                                </Card.Body>
                                                </section>
                                                </>
                                                )
                                            }
                                           
                                           
                                            <ModalForm show={show} handleClose={handleClose} handleChange={handleChange } handleSubmit={handleSubmit} />
                                </Card> 
                            }   
                            {
                                (linkTag === "Tags") &&
                                <Card border="info" style={{ width: '47rem' }} bg={'light'}>
                                    <Card.Header>{  <h2 className="title">{featuredResult.tagName} </h2>}</Card.Header>
                                </Card> 

                            }   

            </div>
        </main>
    )

}

export default Feature;