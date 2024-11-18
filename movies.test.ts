import assert from "node:assert";
import axios from "axios";
import nock from "nock";

// mock third-party api request and response
console.log("starting test case...");
nock("https://api.themoviedb.org")
  .get("/3/discover/movie")
  .query({
    language: "en-US",
    page: "1",
    primary_release_year: "2020",
    sort_by: "popularity.desc",
  })
  .reply(200, {
    results: [
      {
        id: 1,
        title: "Movie Title",
        release_date: "2020-01-01",
        vote_average: 7.5,
      },
    ],
  });
console.log("data fetched");

// mock async api call for credits
async function testGetMovies() {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&primary_release_year=2020&sort_by=popularity.desc",
      {
        headers: {
          Authorization: process.env.BEARER,
        },
      }
    );

    // checking response status and presence of data
    assert.strictEqual(response.status, 200, "Status code should be 200");
    assert.ok(
      response.data.results.length > 0,
      "Should return at least one movie"
    );
    assert.strictEqual(
      response.data.results[0].title,
      "Movie Title",
      'First movie title should be "Movie Title"'
    );
    console.log("Test passed: Initial axios GET request successful");
  } catch (error) {
    console.error("Test failed:", { error });
  }
}

// Run the test
testGetMovies();
