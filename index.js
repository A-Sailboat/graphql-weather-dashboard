const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const axios = require("axios");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "https://henryproctor.com",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const typeDefs = gql`
  type Weather {
    temperature: Float
    description: String
    city: String
    country: String
  }

  type Forecast {
    datetime: String
    temperature: Float
    description: String
  }

  type WeatherWithForecast {
    current: Weather
    forecast: [Forecast]
  }

  type City {
    name: String
    placeId: String
    description: String
    countryCode: String
  }

  type Query {
    getWeather(city: String!, countryCode: String): WeatherWithForecast
    searchCities(cityName: String!): [City]
  }
`;

const resolvers = {
  Query: {
    getWeather: async (_, { city, countryCode }) => {
      const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

      const locationQuery = countryCode
        ? `${city.trim()},${countryCode.trim()}`
        : city.trim();

      const currentWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${locationQuery}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${locationQuery}&appid=${OPENWEATHER_API_KEY}&units=metric`;

      try {
        const [currentResponse, forecastResponse] = await Promise.all([
          axios.get(currentWeatherUrl),
          axios.get(forecastUrl),
        ]);

        const currentData = currentResponse.data;
        const forecastData = forecastResponse.data.list;

        const dailyForecast = forecastData
          .filter((item) => item.dt_txt.includes("12:00:00"))
          .slice(0, 5); // first five days

        return {
          current: {
            temperature: currentData.main.temp,
            description: currentData.weather[0].description,
            city: currentData.name,
            country: currentData.sys.country,
          },
          forecast: dailyForecast.map((forecast) => ({
            datetime: forecast.dt_txt,
            temperature: forecast.main.temp,
            description: forecast.weather[0].description,
          })),
        };
      } catch (error) {
        throw new Error("City not found or failed to fetch data");
      }
    },

    searchCities: async (_, { cityName }) => {
      const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
      const autocompleteResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: cityName,
            types: "(cities)",
            key: GOOGLE_API_KEY,
          },
        }
      );

      const cities = await Promise.all(
        autocompleteResponse.data.predictions.map(async (prediction) => {
          const placeDetailsResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json`,
            {
              params: {
                place_id: prediction.place_id,
                key: GOOGLE_API_KEY,
              },
            }
          );

          const addressComponents =
            placeDetailsResponse.data.result.address_components;
          const countryComponent = addressComponents.find((component) =>
            component.types.includes("country")
          );
          const countryCode = countryComponent
            ? countryComponent.short_name
            : null;

          return {
            name: prediction.structured_formatting.main_text,
            placeId: prediction.place_id,
            description: prediction.description,
            countryCode: countryCode,
          };
        })
      );

      return cities;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
