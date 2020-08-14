import axios from 'axios';

export default ({req}) => {
  if(typeof window === 'undefined') {
    //on server
    return axios.create({
      baseURL: 'http://172.17.0.2',
      headers: req.headers
    });
  }
  else {
    //on browser
    return axios.create({
      baseURL: '/'
    });
  }
}
