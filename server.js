require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const cors = require("cors")
const MOVIESDB = require("./movies-data-small.json")

const app = express()

app.use(morgan("dev"))
app.use(helmet())
app.use(cors());
app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get("Authorization");
    const apiToken = process.env.API_TOKEN;

    if(!authToken || authToken.split(" ")[1] !== apiToken) {
        return res.status(401).json({error: "Unauthorized Request"})
    }
    console.log("validate bearer token middleware")
    next()
})

app.get("/movie", function getMovies(req,res) {
    let response = MOVIESDB

    if(req.query.genre) {
        response = response.filter(movie => {
            return movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        }) 
    }
    if(req.query.country) {
        response = response.filter(movie => {
            return movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        })
        
    }
    if(req.query.avg_vote) {
        response = response.filter(movie => {
            return movie.avg_vote >= Number(req.query.avg_vote)
        })
    }
   

    res.json(response)
})

const PORT = 8000;

app.listen(8000, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})