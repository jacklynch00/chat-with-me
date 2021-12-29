# Chat With Me

## Contents
- [Description](#description)

## Description
This is a **_very_** simple chat app that allows 2 or more people to communicate with each other by typing in their name and then a message. Check the

## How to use with Docker
   > This is under the assumption that you have installed Docker already (Go [Here](https://docs.docker.com/get-docker/) for help)
- In the root directory, run `docker-compose up -d --build`
    - This will create the images and containers and then run them in detached mode
- You can now access the frontend on `https://localhost:3000`
- Run `docker-compose down` to turn of the server and frontend

## How to use without Docker

1. Download repository

    ```git clone <repo link>```

2. Install server dependencies and start the server
  - Enter the server directory: ```cd chat-with-me/server```

    ```yarn install``` or ```npm install```
    then
    ```yarn start``` or ```npm start```

3. Install frontend dependencies and start the frontend
  - Enter the frontend directory: ```cd chat-with-me/frontend```

    ```yarn install``` or ```npm install```
    then
    ```yarn start``` or ```npm start```

4. Navigate to ```http://localhost:3000/``` to view the chat app and begin chatting :)
