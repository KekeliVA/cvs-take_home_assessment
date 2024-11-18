# CVS Take Home Coding Assessment for Kekeli Afantchao

## Description

The project takes in the year YYYY, which is used to make API calls to:
[Discover Movie API](https://developer.themoviedb.org/reference/discover-movie) and [Movie Credit API](https://developer.themoviedb.org/reference/movie-credits)

Additionally, I’ve added functionality to retrieve the editors for each movie in the response. Using TypeScript, I ensured the project met the required data specifications, allowing for the optional inclusion of editor information as an extra deliverable.

## How to Run It

1. Clone the repository:

```
git clone <https://github.com/KekeliVA/cvs-take_home_assessment>
cd <cvs-cli> project directory
```

2. Install Dependencies:

```
npm install
```

This will install Axios, Express, Dotenv, Nock, and TS-Node

3. Running the App:

- You'll want to use a REST client of your choice and make a `get` request at `http://localhost:PORT/movies/:year` or whatever the appropriate network location will be for your organization.

- Use `npm start` to run the server.

- Use the path parameters as the input for your desired year in `YYYY` format.

- Confirm and send the request.

4. Running the Tests:

`npx ts-node <movies.test.ts>`

## Technologies Used:

- TypeScript
- Nock (for HTTP request mocking)
- Assert (for testing)
- Node.js

## Project Structure:

- `cvs-cli` is the root folder
- `index.ts` contains the server logic
- `types.ts` contains TypeScript interfaces
- `movies.test.ts` contains Assert and Nock unit tests
