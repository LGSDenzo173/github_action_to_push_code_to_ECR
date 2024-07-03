# Project Name: Ecowas

## Table of Contents

- [Introduction](#introduction)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Contributing](#contributing)
- [License](#license)

## Introduction

ECOWAS Sankey is a Sankey visualization for the energy balance and CO2 emissions data of the 15 ECOWAS countries.

## Requirements

- Operating System: Windows, macOS, or Linux
- Required Software: Node.js.
- Required Libraries or Frameworks: Bcrypt, Express, Sequelize, SendGrid.

## Installation

### Windows, macOS and Linux

1. Install Node.js by running the following command in the terminal: sudo apt-get install nodejs
2. Install the Node.js package manager npm by running the following command: 
```shell
sudo apt-get install npm
```
3. Open the terminal and navigate to the directory where you want to install the project.
4. Clone the project repository by running the following command: 
```shell
git clone <repository URL>
```
5. Navigate to the project directory by running the following command: 
```shell
cd <project directory>
```

## Configuration

1. Create a .env file
   In the root directory of your project, create a file named .env. This file will contain your environment variables in the format KEY=VALUE, with one variable per line:
```
API_KEY=myapikey123
```
```
SECRET_KEY=mysecretkey456
```
2. Add .env file to .gitignore
   Add the .env file to your .gitignore file to prevent it from being committed to the repository. This is important to protect sensitive information from being exposed in the repository. Open or create a .gitignore file in your project root and add the following line:

.env

3. Install dotenv package
   Install the dotenv package in your Node.js project. This package allows you to easily load the environment variables from the .env file into your application. Run the following command to install it:
```shell
npm install dotenv
```
4. Load dotenv in your Node.js application (example)
   In your Node.js application, load the dotenv package and call the config() method at the beginning of your main file (usually app.js or index.js). This will load the environment variables from the .env file:
```shell
require('dotenv').config();
```

5. Access environment variables
   Now you can access the environment variables from the .env file using process.env in your application:
```shell
const apiKey = process.env.API_KEY;
const secretKey = process.env.SECRET_KEY;
```
```shell
console.log(`API Key: ${apiKey}`);
console.log(`Secret Key: ${secretKey}`);
```
By following these steps, you can create a .env file in your project repository and use it to manage environment variables in your Node.js application. Remember to replace the placeholder variable names and values in the .env file with your actual environment variables.

## Running the Project

1. Install dependencies:
```shell
npm install or npm i
```

2. Run the application:
```shell
npm start
```

Or

```shell
node server | bunyan #install bunyan globally for good formatting of logs
```

Or

```shell
npm run server (hot reloading)
```

3. To stop the application run: 
```shell
npm run stop
```

## Contributing

If you are interested in contributing to this project, please follow given guidelines:

1. Before submitting a pull request, please open an issue to discuss changes and avoid duplicate efforts.
2. To submit a pull request, fork the repository and make changes in the forked repository.
3. Make sure your changes follow the given points to ensure consistency in the codebase:
    * Coding Conventions (validations and formations).
    * It passes all automations tests. 
    * It is properly documented.
4. Provide a clear description of your changes in your pull request.
5. Submit your pull request. We will review your contribution and get back to you as soon as possible.

## Demo

[http://ecowasbackend-env.eba-hvykxkzm.eu-west-1.elasticbeanstalk.com/](http://ecowasbackend-env.eba-hvykxkzm.eu-west-1.elasticbeanstalk.com/)

## License

This project is licensed under K2X Tech.
