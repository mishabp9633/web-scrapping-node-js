const express = require("express")
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const axios = require("axios")
const app = express()
app.set('view engine', 'ejs');

var CronJob = require('cron').CronJob;
var job = new CronJob(
    '1 * * * * *',
    function () {
        console.log('You will see this message every second');
    },
    null,
    true,
    'America/Los_Angeles'
);

job.start()

const URL = "https://www.amazon.ae/s?k=iphone+14&sprefix=iphone+%2Caps%2C185&ref=nb_sb_ss_ts-doa-p_3_7"

async function fetchData() {
    try {
        const response = await axios.get(URL, {
            method: "GET",
            headers: {
                "Host": 'www.amazon.ae',
                "upgrade-insecure-requests": 1,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
            }
        })
        const { document } = (new JSDOM(response.data)).window
        const products = []
        document.querySelectorAll(".s-card-container").forEach(element => {
            products.push({
                image: element.querySelector(".s-image").src,
                title: element.querySelector("h2 span").textContent,
                price: element.querySelector(".a-price-whole").textContent
            })
        })
        return products
    } catch (error) {
        console.log(error, "==error");
    }
}

app.get('/', async (req, res) => {
    const products = await fetchData()
    res.send('pages/index.ejs', { products });
});

app.listen(3000, () => console.log("Server started"))

