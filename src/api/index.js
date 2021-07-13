import axios from 'axios';
const BASE_URL = "http://localhost:5000";


export async function fetchAllLinks() {
  try {
    const { data } = await axios.get(`/api/links`);
    return data;
  } catch (error) {
    throw error;
  }
}

export const fetchAllTags = async() =>{
  try {
    const { data } = await axios.get(`/api/tags`)
    return data
  } catch (error) {
    throw error
  }
} 

export const createTagFrontEnd = async(tagName) =>{
    try{
       const {data} = await axios.post(`/api/tags`,{
        tagName, 
      });
      return data;
    }catch(error){
      throw error
    }
}

export const createLinkFrontEnd = async(url, comment) => {
  console.log(url, comment);
  try {
    const {data} = await axios.post(`/api/links`,{
      url, comment
    });
    return data;
  } catch (error) {
    throw error
  }
}

export const addTagToLinkFrontEnd = async(linkId, tagId) =>{
    try {
      const {data} = await axios.post(`/api/links/${linkId}/tags`,{
        tagId
      });
      return data;
    } catch (error) {
      throw error
    }
}

export const addClickCountFrontEnd = async(linkId, url, comment, clickCount) => {
    const clickCountInt = parseInt(clickCount++);
    try {
      const {data} = await axios.patch(`/api/links/${linkId}`,{
        url, comment, clickCount
      })
      return data;
    } catch (error) {
      throw error
    }
}

export const deleteLinkFrontEnd = async(linkId) =>{
  try {
    const {data} = await axios.delete(`/api/links/${linkId}`)
    return data
  } catch (error) {
    throw error
  }
}