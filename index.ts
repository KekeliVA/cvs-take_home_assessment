/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import express, { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";
import {
  Movie,
  DiscoverMoviesResponse,
  CrewMember,
  Editors,
  HomerunMovie,
} from "./types.js";

// initialiaze express server
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

// parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ensuring server is able to reach base root
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Server is up and running!" });
});

// main logic to gather movie and credits data
app.get("/movies/:year", async (req: Request, res: Response) => {
  const { year } = req.params;
  // Interface Extends this & this for homerun response

  // final variable which will be sent out as a response to client
  const homerun: any = [];

  try {
    const response: AxiosResponse<DiscoverMoviesResponse> = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&primary_release_year=${year}&sort_by=popularity.desc`,
      {
        headers: {
          Authorization: process.env.BEARER,
        },
      }
    );

    const movies: Movie[] = response.data.results;

    for (const movie of movies) {
      homerun.push({
        title: movie.title,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        editors: [],
      });
    }

    const credit_promises = response.data.results.map((movie: any, i: any) => {
      return axios
        .get(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
          headers: {
            Authorization: process.env.BEARER,
          },
        })
        .then((credits_response) => {
          const editors: Editors = credits_response.data.crew
            .filter(
              (crew_member: CrewMember) =>
                crew_member.known_for_department === "Editing"
            )
            .map((editor: Editors) => editor.name);
          console.log(editors);

          homerun[i] = {
            ...homerun[i],
            editors,
          };
        });
    });

    // waiting for all promises from credit_promises ensures the homerun variable will not be sent to client without editors
    await Promise.all(credit_promises);
    res.status(200).send(homerun as HomerunMovie[]);
    return homerun;
  } catch (error) {
    console.error("error fetching movies", error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occured" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Welcome to express, listening on https://localhost:${PORT}`);
});
