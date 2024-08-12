import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import WeatherDashboardHeader from "./WeatherDashboardHeader";
import WeatherCard from "./WeatherCard";
import { useLazyQuery, gql } from "@apollo/client";

const GET_WEATHER = gql`
  query GetWeather($city: String!, $countryCode: String) {
    getWeather(city: $city, countryCode: $countryCode) {
      current {
        temperature
        description
        city
        country
      }
      forecast {
        datetime
        temperature
        description
      }
    }
  }
`;

const defaultCities = ["San Francisco"];

const WeatherDashboard = () => {
  const [weatherCards, setWeatherCards] = useState([]);

  const [getWeather] = useLazyQuery(GET_WEATHER, {
    onCompleted: (data) => {
      if (data) {
        setWeatherCards((prevCards) => [...prevCards, data.getWeather]);
      }
    },
  });

  useEffect(() => {
    document.title = "Weather Dashboard";

    const loadDefaultCities = async () => {
      const weatherPromises = defaultCities.map((defaultCity) =>
        getWeather({ variables: { city: defaultCity } })
      );

      const weatherResults = await Promise.all(weatherPromises);
      const newWeatherCards = weatherResults.map(
        (result) => result.data.getWeather
      );

      setWeatherCards(newWeatherCards);
    };

    loadDefaultCities();
  }, [getWeather]);

  const handleDeleteCard = (indexToDelete) => {
    setWeatherCards((prevCards) =>
      prevCards.filter((_, index) => index !== indexToDelete)
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        color: "#ECEFF1",
      }}
    >
      <WeatherDashboardHeader
        setWeatherCards={setWeatherCards}
        getWeather={getWeather}
      />

      <div
        style={{
          marginTop: "4.5rem",
          flexGrow: 1,
          padding: "2rem 0",
          backgroundColor: "#1B2A3D",
        }}
      >
        <Container maxWidth="md" style={{ flexGrow: 1 }}>
          {weatherCards.length === 0 && (
            <Typography
              textAlign="center"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Search a city to get started!
            </Typography>
          )}
          <Grid container spacing={3}>
            {weatherCards.map((weatherData, index) => (
              <WeatherCard
                key={index}
                weatherData={weatherData}
                onDelete={() => handleDeleteCard(index)}
              />
            ))}
          </Grid>
        </Container>
      </div>

      <IconButton
        href="https://github.com/A-Sailboat/graphql-weather-dashboard"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
          zIndex: 2000,
          color: "#ECEFF1",
          backgroundColor: "rgba(44, 62, 80, 0.7)",
          borderRadius: "50%",
        }}
      >
        <GitHubIcon fontSize="large" />
      </IconButton>

      <Typography
        variant="caption"
        style={{
          color: "#555",
          position: "fixed",
          bottom: "10px",
          right: "10px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Powered by GraphQL
      </Typography>
    </div>
  );
};

export default WeatherDashboard;
