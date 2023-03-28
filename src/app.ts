import axios from "axios";
import express, { Request, Response, NextFunction } from "express";
import { validationResult, param, query } from "express-validator";
const app = express();

const apiKey = "21396536a373fc5802cbc8fdf34c40d1";
const baseUrl = "https://api.openweathermap.org/data/2.5";
const randomUserApi = "https://randomuser.me/api/";

app.get("/random", async (req, res) => {
  const { data } = await axios.get(randomUserApi);
  const obj = {
    name: data.results[0].name.first,
    surname: data.results[0].name.last,
    city: data.results[0].location.city,
    weather: "",
  };
  try {
    const response = await axios.get(
      `${baseUrl}/weather?q=${obj.city}&appid=${apiKey}`
    );
    obj.weather = response.data.weather[0].main;
  } catch (err) {
    obj.weather = "Not supported....";
  }
  res.json(obj);
});

// app.get("/locations/:city", async ({ params }, res) => {
//   console.log("sta chiamando qualcuno?");
//   const { data } = await axios.get(
//     `${baseUrl}/weather?q=${params.city}&appid=${apiKey}`
//   );
//   res.json(data);
// });

app.listen(3001, () => console.log("Server is running!"));
