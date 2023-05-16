import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

app.server = http.createServer(app);

app.get("/", (req, res) => {
    res.send('API RUNNING OK 👌')
})

app.server.listen(port, () => {
    console.log(`Started on port ${port}`)
})