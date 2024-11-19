import dotenv from "dotenv";
import morgan from "morgan";
import express from "express";
import methodOverride from "method-override"

dotenv.config();

import "./DB/connection.js";
import Garment from "./Models/garment.js"


const app = express();


//Middlewares
app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req,res) => {
    res.render("home.ejs");
});



app.get("/clothes/new", (req, res) => {
    res.render("clothes/new.ejs");
});


app.get("/clothes/:garmentId", async (req,res) => {
    try {
        const id = req.params.garmentId;
        const garment = await Garment.findById(id);

        res.status(200).render("clothes/show.ejs", {garment: garment});
    }catch (error) {
        console.error(error);
        res.status(404).send("Garment not found")
    }
});

app.get("/clothes/:garmentID/edit", async (req,res) => {
    try {
        const id = req.params.garmentID;
        const garment = await Garment.findById (id);

        res.status(200).render("clothes/edit.ejs", { garment: garment });
    } catch (error) {
        console.error(error);
        res.status(500).send("Cannot load edit form")
    }
});


//Garment idx page
app.get("/clothes", async (req, res) => {
    try{
        const allGarments = await Garment.find({});
        res.render("clothes/index.ejs", {
            clothes: allGarments });
    } catch (error) {
        console.error(error);
        res.send("There was an error getting all garments")
    }
});

//POST
app.post("/clothes", async (req, res) => {
    try {
        req.body.isAvailable = req.body.isAvailable === "on" ? true : false;
        const newGarment = await Garment.create(req.body);

        res.status(200).redirect("/clothes");
    } catch (error) {
        console.error(error);
        res.status(400).send("There was an error creating a new garment")
    }
})

//PUT
app.put("/clothes/:garmentId", async (req, res) => {
    try {
        const id = req.params.garmentId;
        req.body.isAvailable =req.body.isAvailable === "on" ? true : false;
        const updateData = req.body;
        const updatedGarment = await Garment.findByIdAndUpdate(id, updateData, {new: true,
        });

        res.redirect("/clothes")
    }catch (error) {
        console.error(error);
        res.status(500).send("Error updating garment")
    }
});

//Delete
app.delete("/clothes/:garmentId", async (req, res) => {
    try {
        const id = req.params.garmentId;
        const deletedGarment = await Garment.findByIdAndDelete(id);
        res.status(200).redirect("/clothes");
    } catch (error) {
        console.error(error);
        res.status(500).send("Could not delete the garment");   
     }
});




app.listen(3000, () => {
      console.log('Listening on port http://localhost:3000');

});