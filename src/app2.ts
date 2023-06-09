import axios from "axios";
import express, { Request, Response, NextFunction } from "express";
import { validationResult, param, query } from "express-validator";
const app = express();
const urlProducts = "https://fakestoreapi.com/products";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

app.use(express.json());

const checkErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

app.get("/status", (_, res) => res.json({ message: "Server is running!" }));

app.get(
  "/products",
  query("limit").optional().isInt().toInt(),
  query("skip").optional().isInt().toInt(),
  query("q").optional().isString(),
  checkErrors,
  async ({ url, query }, res) => {
    const arr = url.split("?");
    const response = await axios.get(
      `${urlProducts}${arr[1] ? "?" + arr[1] : ""}`
    );
    const { data }: { data: Product[] } = response;
    if (query.q) {
      res.json(
        data.filter(
          ({ title, description }) =>
            title.includes(query.q as string) ||
            description.includes(query.q as string)
        )
      );
    } else {
      res.json(data);
    }
    // .then(({ data }: { data: Product[] }) => {
    //   if (query.q) {
    //     res.json(
    //       data.filter(
    //         ({ title, description }) =>
    //           title.includes(query.q as string) ||
    //           description.includes(query.q as string)
    //       )
    //     );
    //   } else {
    //     res.json(data);
    //   }
    // });
    console.log("ciao");
  }
);

app.get(
  "/products/:id",
  param("id").isInt().toInt(),
  checkErrors,
  ({ params: { id } }, res) => {
    axios.get(`${urlProducts}/${id}`).then(({ data }) => {
      res.json(data);
    });
  }
);
console.log("thread principale");
app.listen(3001, () => console.log("Server is running!"));
