require ('dotenv').config();
const express     = require('express');
const morgan      = require('morgan');
const cors        = require('cors');
const client      = require('./db/client');
const apiRouter   = require('./api')

//const PORT    = (process.env.PORT || 5000);
const PORT = process.env.PORT || 5000;
const server  = express();

server.use(express.json());
server.use(cors());
server.use(morgan('dev'));

server.use((req, res, next)=>{
  console.log("req.path", req.path);
  next()
})

const path = require("path");
server.use(express.static(path.join(__dirname, "build")));

server.use('/api', apiRouter);

server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const startServer = async () => {
  await client.connect();
  console.log(`DB connected`);

 server.listen(PORT, () => {
  console.log(`Server is now listening on PORT:${PORT}`);

 })
}
startServer();