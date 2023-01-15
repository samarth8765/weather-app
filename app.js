const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8000;
const hbs = require('hbs');
const https = require('https');
require("dotenv").config();

// for static files
const staticPath = path.join(__dirname,"/public");
app.use(express.static(staticPath));

// for dynamic files
const templatePath = path.join(__dirname, '/templates/views')
app.set('view engine','hbs');
app.set('views', templatePath);

// hbs partials
const partialPath = __dirname + '/templates/partials';
hbs.registerPartials(partialPath)

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/about',(req,res)=>{
    res.render('about')
});

app.get('/weather',(req,res)=>{
    var city = req.query.cityName;
    const API_KEY = process.env.API_KEY;
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    let date = new Date().toJSON().slice(0,10);

    https.get(url,(response)=>{
        response.on('data',(data)=>{
            const weatherData = JSON.parse(data);
            if(weatherData.cod == 400){
                res.render('weather',{
                    city : "",
                    temp: "",
                    date : date
                })
            }
            else if (weatherData.cod == 200){
                let temp = (weatherData.main.temp - 273.15).toFixed(2);
                let country = weatherData.sys.country;
                let desc = weatherData.weather[0].description.toUpperCase();
                res.render('weather',{
                    city : `${city.toUpperCase()},${country}`,
                    temp : temp,
                    o : 'o',
                    C : ' C',
                    description: desc,
                    date : date
                })
            }
            else {
                res.render('weather',{
                    city : `Invalid City Name`,
                    date : date
                });
            }
    
            
        })
    });
}); 


app.get('/*',(req,res)=>{
    res.render('404_error');
});

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});