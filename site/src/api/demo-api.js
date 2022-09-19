import slugify from "slugify"
import { singleCocktail } from "single-cocktail"
const handler = (req, res) => {
    const href = graphql.post("/");
    slugify("police");
    singleCocktail();
    if(req.method) console.log(req.body);
  } 
 export default handler