import https from 'https';
import axios from 'axios';

const instance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

export default instance;
