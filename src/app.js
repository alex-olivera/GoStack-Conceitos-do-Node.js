const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Constants
const INITIAL_LIKES = 0;

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  //Validate ID
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' })
  }

  //Check if ID exists
  const repositoryIndex = repositories.findIndex( repository => repository.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "ID not found."});
  }

  //Add repository index referring to ID in the request object
  request.repositoryIndex = repositoryIndex;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: INITIAL_LIKES
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { repositoryIndex } = request;
  const { title, url, techs } = request.body;

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs
  };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { repositoryIndex } = request;

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
