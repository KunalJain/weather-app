const readline = require('readline');

class WeatherClothingRecommender {
    constructor() {
        this.weatherConditions = {
            SUNNY: 'sunny',
            RAINY: 'rain',
            THUNDERSTORM: 'thunderstorm',
            COLD: 'snow',
            HOT: 'hot',
            WINDY: 'windy',
            CLOUDY: 'clouds',
            DRIZZLE: 'drizzle',
            CLEAR: 'clear'
        };
    }

    getRecommendation(temperature, weatherCondition) {
        let recommendation = "\nBase layer: T-shirt and underwear\n";

        if (temperature < 10) {
            recommendation += "It's cold! Wear a warm coat, scarf, and gloves.\n";
        } else if (temperature < 20) {
            recommendation += "It's cool. A light jacket or sweater would be good.\n";
        } else if (temperature < 30) {
            recommendation += "It's warm. A t-shirt and light pants are perfect.\n";
        } else {
            recommendation += "It's hot! Wear light, breathable clothing.\n";
        }

        switch (weatherCondition) {
            case this.weatherConditions.RAINY || this.weatherConditions.THUNDERSTORM || this.weatherConditions.DRIZZLE:
                recommendation += "Don't forget an umbrella and waterproof jacket!\n";
                break;
            case this.weatherConditions.WINDY || this.weatherConditions.CLOUDY:
                recommendation += "A windbreaker might be useful today.\n";
                break;
            case this.weatherConditions.SUNNY || this.weatherConditions.CLEAR:
                recommendation += "Don't forget sunglasses and sunscreen!\n";
                break;
        }

        return recommendation;
    }
}

const recommender = new WeatherClothingRecommender();
const apiKey = 'ddda74cfc8cbcbfd8a5bb9ab5f1e27ae';
let temperature = null;
let weatherCondition = null;
let city = null;

async function getWeatherData(city) {
    try {
        const encodedCity = encodeURIComponent(city);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${apiKey}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City "${city}" not found. Please check the spelling or try adding the country code (e.g., "London,UK")`);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.log('Error fetching data:', error.message);
        throw error;
    }
}
async function main() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        city = await new Promise((resolve) => {
        rl.question('Enter city name: ', resolve);
    });
     rl.close();

        const data = await getWeatherData(city);
        temperature = data.main.feels_like;
        weatherCondition = data.weather[0].main;
        console.log("Current weather condition: " + data.weather[0].main);
        console.log("Feels like: " + data.main.feels_like);
        console.log(recommender.getRecommendation(temperature, weatherCondition));
    } catch (error) {
        console.log('Error:', error.message);
        rl.close();
    };}
    
main();
