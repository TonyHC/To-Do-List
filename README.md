# toDoList
Full stack web application developed using
  - HTML and CSS as the frontend
  - Express.js with Node.js along with EJS for the backend
  - Store all the data in [MongoDB Atlas](https://www.mongodb.com/atlas/database) using the mongoose package

## How to build and run the image using Docker
- Change to the directory containing the Dockerfile and .dockerignore
- Run the following Docker command to build the Docker image: 
  - `docker build -t to-do-list .`
- Enter this Docker command after the image is built to run the image in a Docker container:
  - `docker run --name to-do-list -d -p 3000:3000 to-do-list:latest`

## How to visit the web application
Visit [toDoList](http://localhost:3000) to access the web app