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