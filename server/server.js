import cors from "cors";
import express from "express";
import fetch from "node-fetch";
import cron from "node-cron";
const app = express();
const port = 3000;
app.use(cors());
// Initialize an object to store gold prices
let Prices = {
  goldPrice: null,
  silverPrice: null,
};

const fetchGoldPrices = async () => {
  try {
    const response = await fetch("https://www.goldapi.io/api/XAU/INR", {
      method: "GET",
      headers: {
        "x-access-token": "goldapi-64983wrlo5u3vld-io",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const goldPriceData = await response.json();
      return goldPriceData;
    } else {
      console.error("Failed to fetch gold price data.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    return null;
  }
};

const fetchSilverPrices = async () => {
  try {
    const response = await fetch("https://www.goldapi.io/api/XAG/INR", {
      method: "GET",
      headers: {
        "x-access-token": "goldapi-64983wrlo5u3vld-io",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const silverPriceData = await response.json();
      return silverPriceData;
    } else {
      console.error("Failed to fetch gold price data.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    return null;
  }
};

cron.schedule("0 10,14 * * *", async () => {
  // Fetch gold prices
  const goldPrice = await fetchGoldPrices();
  const silverPrice = await fetchSilverPrices();
  if (goldPrice !== null) {
    Prices.goldPrice = goldPrice;
  }
  if (silverPrice !== null) {
    Prices.silverPrice = silverPrice;
  }
});
// Endpoint to get gold prices
app.get("/goldPrices", (req, res) => {
  res.json(Prices.goldPrice);
});
app.get("/silverPrices", (req, res) => {
  res.json(Prices.silverPrice);
});
console.log(Prices.goldPrice);
console.log(Prices.silverPrice);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
