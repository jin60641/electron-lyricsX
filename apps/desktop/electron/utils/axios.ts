import axios from 'axios';
import https from 'https';

const instance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

export default instance;
