import React, {useState} from 'react';
import '../style.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import {createTagFrontEnd, addTagToLinkFrontEnd, fetchAllLinks, fetchAllTags, addClickCountFrontEnd} from '../api'



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

const Feature = ({featuredResult, setTagsList, setLinkList, linkList}) =>{


    const [show, setShow] = useState(false);
    const [newTag, setNewTag] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewTag((prevNewTag)=>{
            return{
                ...prevNewTag,
            [name]: value
        }})
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
        console.log("linkcount", id, clickCount);
        const response = await addClickCountFrontEnd(id, url, comment, clickCount);
        console.log("click count", response);

        if(response){
            const newLinksList = [...linkList].map((link)=>{
                link.id === id && link.clickCount++;
                return link 
            })
            setLinkList(newLinksList)
        }
    };

    if(!featuredResult) return <main id="feature"></main>
    console.log("featuredResult",featuredResult)
    const {id, url, clickCount, tags, comment,  tagName} = featuredResult
    return (
        <main id="feature">
            <div className="object-feature">
                <header>
                    <h3><a onClick={()=>{updateLink(id, url, comment, clickCount)}} href={url} target="blank">{url}</a></h3>
                   {  <h4>clicked: {clickCount} times.</h4>}
                </header>
                                <Card border="info" style={{ width: '18rem' }} bg={'Light'}>
                                    <Card.Header>{  <h2 className="title">Tags: </h2>}</Card.Header>
                                            {
                                                tags && (
                                                <>
                                                <section className="content"> 
                                                {
                                                    tags.map((tag)=>{ return <Card.Text key={tag.id} className="content" >{tag.tagName}</Card.Text> })
                                                }
                                                </section>

                                                </>
                                                )
                                            }
                                            <button onClick={()=>{handleShow()}}>Add tag</button>

                                        <ModalForm show={show} handleClose={handleClose} handleChange={handleChange } handleSubmit={handleSubmit} />
                                </Card>    
            </div>
        </main>
    )

}

export default Feature;