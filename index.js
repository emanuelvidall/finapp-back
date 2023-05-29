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
        const { data: users, error } = await supabase.from('users').select('*');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
});

app.post('/users/register', async (req, res) => {
    try {
        console.log(req.body);
        const { login, password } = req.body;

        const { data: existingUser, error } = await supabase
            .from('users')
            .select()
            .eq('login', login);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(password, salt);
        const newUser = { login: login, password: hashed };

        const { data, error: insertError } = await supabase
            .from('users')
            .insert([newUser]);

        if (error || insertError) {
            return res.status(500).json({ message: 'Error ao adicionar usuário', error });
        }

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error ao adicionar usuário', error });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      const { data, error } = await supabase
        .from('users')
        .delete
        .eq('id', userId)
  
      if (error) {
        return res.status(500).json({ message: 'Error retrieving user', error });
      }
  
      if (!data) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(204).json({message: 'Usuário deletado com sucesso'});
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error });
    }
  });
  