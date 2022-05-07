import axios from 'axios';

//https://sujeitoprogramador.com/r-api/?api=filmes

const api = axios.create({
  // baseURL: 'http://localhost:8080/'
  // baseURL: 'http://192.168.0.111:8080/'
  // baseURL: 'http://192.168.0.23:8080/'
  // baseURL: 'https://crud-stareng.herokuapp.com/'
  baseURL: 'https://ola-task.herokuapp.com/'
});

export default api;