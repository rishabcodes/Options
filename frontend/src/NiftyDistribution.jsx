import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import {
  Box,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTheme } from "./ThemeContext";
import "./NiftyDistribution.css";

export default function NiftyDistribution() {
  const [dates, setDates] = useState([]);
  const [rangeValues, setRangeValues] = useState([0, 0]);
  const [daysExpiry, setDaysExpiry] = useState(1);
  const [dailyData, setDailyData] = useState(null);
  const [plotData, setPlotData] = useState(null);
  const [usedVol, setUsedVol] = useState(null);
  const [error, setError] = useState("");

  const { theme, darkMode, setDarkMode } = useTheme();

  useEffect(() => {
    fetch("/api/dates")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.dates.sort();
        setDates(sorted);
        setRangeValues([0, sorted.length - 1]);
      })
      .catch(() => setError("Error fetching dates."));
  }, []);

  const getDateDiffInDays = (date1, date2) =>
    Math.max(
      Math.ceil((new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24)),
      1
    );

  const startDate = dates[rangeValues[0]];
  const endDate = dates[rangeValues[1]];
  const maxExpiry =
    startDate && endDate ? getDateDiffInDays(startDate, endDate) : 1;

  useEffect(() => {
    if (startDate && endDate) {
      const maxDays = getDateDiffInDays(startDate, endDate);
      if (daysExpiry > maxDays) setDaysExpiry(maxDays);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (endDate) {
      fetch(`/api/data?date=${endDate}`)
        .then((res) => res.json())
        .then((data) => setDailyData(data.data || null))
        .catch(() => setError("Error fetching daily data."));
    }
  }, [endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetch(
        `/api/bellcurve?start_date=${startDate}&end_date=${endDate}&days_to_expiry=${daysExpiry}`
      )
        .then((res) => res.json())
        .then((fig) => {
          setPlotData(fig);
          const match = fig.layout.title.text.match(/Annual Vol=([0-9.]+)/);
          if (match) setUsedVol(parseFloat(match[1]));
        })
        .catch(() => setError("Error fetching bell curve data."));
    }
  }, [startDate, endDate, daysExpiry]);

  const handleDateChange = (newDate, index) => {
    const iso = newDate.format("YYYY-MM-DD");
    const idx = dates.findIndex((d) => d === iso);
    if (index === 0 && idx >= 0 && idx < rangeValues[1]) {
      setRangeValues([idx, rangeValues[1]]);
    }
    if (index === 1 && idx >= 0 && idx > rangeValues[0]) {
      setRangeValues([rangeValues[0], idx]);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        className={`nifty-container ${darkMode ? "dark" : "light"}`}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 2,
        }}
      >
        <Typography variant="h4" className="nifty-title">
          📈 NIFTY Normal Distribution
        </Typography>

        <Box className="theme-toggle" sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            }
            label="Dark Mode"
          />
        </Box>

        {error && <Typography color="error">{error}</Typography>}

        {dates.length > 0 && (
          <>
            {/* Date Pickers */}
            <Box className="date-picker-row" sx={{ mt: 2 }}>
              <Typography>From:</Typography>
              <DatePicker
                value={dayjs(startDate)}
                onChange={(date) => handleDateChange(date, 0)}
                minDate={dayjs(dates[0])}
                maxDate={dayjs(dates[dates.length - 1])}
              />
              <Typography>To:</Typography>
              <DatePicker
                value={dayjs(endDate)}
                onChange={(date) => handleDateChange(date, 1)}
                minDate={dayjs(dates[0])}
                maxDate={dayjs(dates[dates.length - 1])}
              />
            </Box>

            {/* Date Slider */}
            <Box className="slider-box" sx={{ mt: 2, width: "80%" }}>
              <Typography>Date Range Selector</Typography>
              <Slider
                value={rangeValues}
                onChange={(e, val) => setRangeValues(val)}
                min={0}
                max={dates.length - 1}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Expiry Slider */}
            <Box className="slider-box" sx={{ mt: 2, width: "80%" }}>
              <Typography>Days to Expiry: {daysExpiry}</Typography>
              <Slider
                value={daysExpiry}
                onChange={(e, val) => setDaysExpiry(val)}
                min={1}
                max={maxExpiry}
                valueLabelDisplay="auto"
              />
              <Typography variant="caption">Max: {maxExpiry} days</Typography>
            </Box>

            {/* Info + Plot */}
            {endDate && usedVol && (
              <Typography className="daily-info" sx={{ mt: 2 }}>
                                <strong>End Date:</strong> {endDate} |{" "}
                <strong>Volatility Applied:</strong>{" "}
                {(usedVol * 100).toFixed(2)}%
              </Typography>
            )}

            <Box className="plot-wrapper" sx={{ mt: 4, width: "100%" }}>
              {plotData ? (
                <Plot
                  data={plotData.data}
                  layout={{
                    ...plotData.layout,
                    paper_bgcolor: theme.plotBg,
                    plot_bgcolor: theme.plotBg,
                    font: { color: theme.plotFg },
                    xaxis: {
                      ...plotData.layout.xaxis,
                      gridcolor: darkMode ? "#444" : "#ccc",
                    },
                    yaxis: {
                      ...plotData.layout.yaxis,
                      gridcolor: darkMode ? "#444" : "#ccc",
                    },
                  }}
                  style={{ width: "100%", height: "500px" }}
                  useResizeHandler
                />
              ) : (
                <Typography>Loading bell curve...</Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
}

