const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

const users = [];

app.use(cors());
app.use(express.json());

function checksExistsUserAccount(request, response, next) {
   const { username } = request.headers;

   const user = users.find(
     (user) => user.username === username
   );

   if (!user) {
    return response.status(404).json({error: "Username não existe!"});
   }

   request.user = user;

   return next();
}




app.post('/users', (request, response) => {
  const { name, username }  = request.body;
 
  const userAlreadyExists = users.some( 
    (user) => user.username === username  
  );

  if (userAlreadyExists){
    return response.status(400).json({error: "Usuário existente!"});
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.get('/getUsers', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title , deadline } = request.body;

  todo = {
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todo);
  
  return response.status(201).send(todo);
});

// Este
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({error: "Todo não Existe"});
  }

  todo.title    = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

// Este
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(
    (todo) => todo.id === id)
  ;

  if (!todo) {
    return response.status(404).json({error: "Todo não Existe"});
  }

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.findIndex(
    (todo) => todo.id === id
  );

  if (!todo) {
     return response.status(404).json({error: "Todo não Existe"});
  }

  user.todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app; 