import React from "react";
import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  Cloud,
  WbSunny,
  AcUnit,
  Thunderstorm,
  WaterDrop,
} from "@mui/icons-material";

const getWeatherIcon = (description) => {
  if (description.includes("storm"))
    return <Thunderstorm style={{ color: "#FFB74D" }} />;
  if (description.includes("cloud"))
    return <Cloud style={{ color: "#90A4AE" }} />;
  if (description.includes("sun"))
    return <WbSunny style={{ color: "#FFD54F" }} />;
  if (description.includes("rain"))
    return <WaterDrop style={{ color: "#4FC3F7" }} />;
  if (description.includes("snow"))
    return <AcUnit style={{ color: "#81D4FA" }} />;
  return <WbSunny style={{ color: "#FFD54F" }} />;
};

const getLabelForDay = (index, forecastDate) => {
  if (index === 0) return "Tomorrow";
  if (index === 1) return "Overmorrow";

  const date = new Date(forecastDate);
  const day = date.getDate();

  const suffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)}`;
};

const WeatherCard = ({ weatherData, onDelete }) => {
  return (
    <Grid item xs={12}>
      <Card
        style={{
          background: "#34495E",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          position: "relative",
        }}
      >
        <IconButton
          size="small"
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            color: "white",
          }}
          onClick={onDelete}
        >
          <Close style={{ fontSize: "16px" }} />
        </IconButton>
        <CardContent style={{ padding: "8px" }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={4} container alignItems="center">
              <Grid
                item
                style={{
                  paddingRight: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {getWeatherIcon(weatherData.current.description)}
              </Grid>

              <Grid item>
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "600",
                    color: "#ECEFF1",
                  }}
                >
                  {weatherData.current.city}, {weatherData.current.country}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ marginTop: "4px", color: "#B0BEC5" }}
                >
                  {Math.round(weatherData.current.temperature)}°C
                </Typography>
                <Typography
                  variant="body2"
                  style={{ marginTop: "4px", color: "#B0BEC5" }}
                >
                  {weatherData.current.description}
                </Typography>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              md={8}
              container
              spacing={2}
              justifyContent="flex-end"
            >
              {weatherData.forecast.slice(0, 4).map((forecast, index) => (
                <Grid item xs={3} key={index}>
                  <Card
                    style={{
                      backgroundColor: "#455A64",
                      borderRadius: "8px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      padding: "8px",
                    }}
                  >
                    <CardContent
                      style={{
                        textAlign: "center",
                        padding: "4px",
                        color: "#ECEFF1",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        style={{
                          fontWeight: "500",
                          fontSize: "0.8rem",
                          marginBottom: "4px",
                        }}
                      >
                        {getLabelForDay(index, forecast.datetime)}
                      </Typography>
                      {getWeatherIcon(forecast.description)}
                      <Typography
                        variant="body2"
                        style={{ marginTop: "4px", color: "#B0BEC5" }}
                      >
                        {Math.round(forecast.temperature)}°C
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default WeatherCard;
