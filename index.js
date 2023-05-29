import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt';

dotenv.config();
const supabase = createClient(`${process.env.SUPABASE_URL}`, `${process.env.SUPABASE_KEY}`);

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.options('*', cors());
app.server = http.createServer(app);

app.get("/", (req, res) => {
    res.send('API RUNNING OK 👌')
});

app.server.listen(port, () => {
    console.log(`Started on port ${port}`)
});

app.get('/users', async (req, res) => {
    try {
    const { data: products, error } = await supabase.from('users').select('*');  
    res.status(200).json(products);
    } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
    }
});

app.post('/users/register', async (req, res) => {
    try {   
        console.log(req.body);
        const { login, password } = req.body;
        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(password, salt);
        const newUser = { login: login, password: hashed }
        const data  = await supabase.from('produtos').insert({newUser});
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error ao adicionar produto', error });
    } 
    });

