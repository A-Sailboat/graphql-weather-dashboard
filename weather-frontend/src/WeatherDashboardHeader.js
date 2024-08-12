import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useLazyQuery, gql } from "@apollo/client";

const SEARCH_CITIES = gql`
  query searchCities($cityName: String!) {
    searchCities(cityName: $cityName) {
      name
      placeId
      description
      countryCode
    }
  }
`;

const WeatherDashboardHeader = ({ setWeatherCards, getWeather }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [setCity] = useState("");
  const [setCountryCode] = useState("");

  const [fetchCities, { data: cityData }] = useLazyQuery(SEARCH_CITIES);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.length > 2) {
      fetchCities({ variables: { cityName: newValue } });
    }
  };

  const handleSelectCity = (city) => {
    setInputValue(city.name);
    setCity(city.name);
    setSuggestions([]);

    const countryCode = city.countryCode;
    setCountryCode(countryCode);

    getWeather({
      variables: {
        city: city.name,
        countryCode: city.countryCode,
      },
    });
  };

  const handleSearch = () => {
    const cityToSearch = inputValue.trim();

    if (cityToSearch) {
      getWeather({
        variables: {
          city: cityToSearch,
        },
      });
    } else {
      console.log("No city entered");
    }
  };

  useEffect(() => {
    if (cityData && cityData.searchCities) {
      setSuggestions(cityData.searchCities);
    }
  }, [cityData]);

  return (
    <div
      style={{
        backgroundColor: "#2C3E50",
        padding: "1rem",
        width: "100%",
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        borderBottomLeftRadius: "20px",
        borderBottomRightRadius: "20px",
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography variant="h4" color="white" style={{ fontWeight: "600" }}>
            Weather Dashboard
          </Typography>
          <Grid
            item
            xs={8}
            style={{
              display: "flex",
              gap: "1rem",
              width: "100%",
              position: "relative",
            }}
          >
            <div
              className="autocomplete-container"
              style={{ position: "relative", flexGrow: 1 }}
            >
              <TextField
                label="Search City"
                variant="outlined"
                fullWidth
                value={inputValue}
                onChange={handleInputChange}
                InputProps={{
                  style: { color: "#eceff1" },
                }}
              />
              {suggestions.length > 0 && (
                <List
                  className="autocomplete-list"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "#2C3E50",
                    zIndex: 1100,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    borderRadius: "0 0 10px 10px",
                    overflow: "hidden",
                  }}
                >
                  {suggestions.map((city, index) => (
                    <ListItem
                      button
                      key={index}
                      className="autocomplete-list-item"
                      onClick={() => handleSelectCity(city)}
                    >
                      <ListItemText
                        primary={`${city.description
                          .split(",")
                          .slice(0, -1)
                          .join(", ")}, ${city.countryCode}`}
                        style={{ color: "#eceff1" }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              style={{
                backgroundColor: "#2196f3",
                color: "#fff",
              }}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default WeatherDashboardHeader;
