/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv"

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

// parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req: Request, res: Response, next) => {
  res.send({message: "Server is up and running!"})
}) 


app.get("/movies/:year", async (req: Request, res: Response) => {
  const { year } = req.params;
  // Interface Extends this & this for homerun response
  const homerun: any = [];

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&primary_release_year=${year}&sort_by=popularity.desc`,
      {
        headers: {
          Authorization: process.env.BEARER,
        },
      }
    )

    const movies = response.data.results;
    
    // loop through each array element, each element is a movie [i], ill create an object for some of their properties to go to
    /**
     * {
     * title: title
     * release_date: release_date
     * vote_average: vote_average
     * editors: my editors array, ill use dot notation after my second api call to append it to the object
     * }
     */

    for (const movie of movies) {
      homerun.push({
        title: movie.title,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        editors: [],
      })
    }

    /**
     * i think after i get the editors, it's 1:1 with the movie list
     * loop through homerun
     * make [i].editors = editors?
     * for (let i, editors.length, i++) {
     * homerun[i].editors = editors
     * 
     * OR
     * 
     * i could hold off on initializing this new object with an empty editors array
     * and use the spread operator to do it
     * homerun[i]
     * }
     */

    const credit_promises = response.data.results.map((movie: any, i: any) => {
      return axios
        .get(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
          headers: {
            Authorization: process.env.BEARER,
          },
        })
        .then((credits_response) => {
          const editors = credits_response.data.crew.filter(
            (crew_member: any) => crew_member.known_for_department === "Editing"
          ).map((editor: any) => editor.name);
          console.log(editors);
          // const editors = [];
          
          homerun[i] = {
            ...homerun[i],
            editors,
          }
          // for (const member of credits_response.data.crew) {
          //   if (member.known_for_department === "Editing") {
          //     editors.push(member.name)
          //   }
          // }

          // for (let i=0; editors.length, i++;) {
          //   homerun[i] = {
          //     ...homerun[i],
          //     editors: editors[i]
          //   }
          // }
          // console.log(editors);
        });
      });
      
    await Promise.all(credit_promises);
    res.status(200).send(homerun);
    return homerun

    

    // make an interface for the responses
    // Partial<InterfaceName>

  } catch (error) {
    console.error("error fetching movies", error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occured"})
    }
  }
});


app.listen(PORT, () => {
  console.log(`Welcome to express, listening on https://localhost:${PORT}`)
});
