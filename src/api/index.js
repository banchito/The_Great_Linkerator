import axios from 'axios';
const BASE_URL = "http://localhost:5000";


export async function fetchAllLinks() {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/links`);
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
}

export const fetchAllTags = async() =>{
  try {
    const { data } = await axios.get(`${BASE_URL}/api/tags`)
    console.log(data);
    return data
  } catch (error) {
    throw error
  }
} 

export const createTagFrontEnd = async(tagName) =>{
    try{
       const {data} = await axios.post(`${BASE_URL}/api/tags`,{
        tagName, 
      });
      console.log(data)
      return data;
    }catch(error){
      throw error
    }
}

export const createLinkFrontEnd = async(url, comment) => {
  console.log(url, comment);
  try {
    const {data} = await axios.post(`${BASE_URL}/api/links`,{
      url, comment
    });
    console.log("Data",data)
    return data;
  } catch (error) {
    throw error
  }
}

export const addTagToLinkFrontEnd = async(linkId, tagId) =>{
    try {
      const {data} = await axios.post(`${BASE_URL}/api/links/${linkId}/tags`,{
        tagId
      });
      console.log(data)
      return data;
    } catch (error) {
      throw error
    }
}

export const addClickCountFrontEnd = async(linkId, url, comment, clickCount) => {
    console.log("clickCount", clickCount)
    const clickCountInt = parseInt(clickCount++);
    console.log("clickCountInt", clickCountInt)
    try {
      const {data} = await axios.patch(`${BASE_URL}/api/links/${linkId}`,{
        url, comment, clickCount
      })
      console.log(data)
      return data;
    } catch (error) {
      throw error
    }
}