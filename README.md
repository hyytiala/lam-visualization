# Traffic map

[See demo](https://tms.hyytiala.fi/)

## Description

This is a project work for university course Interactive Data Visualization. The application visualizes data from TMS(Traffic Measurement System) stations that are used to count traffic on finnish roads. In the visualization you can see the daily statistics for individual stations. TMS stations are called LAM(liikenteen automaattinen mittausasema) in finnish and there is data for about 500 stations at the moment.

## Key features:

- Easy to understand basemap of Finnish road network
- Clustering of markers on map for easier usage
- Descriptive interactive charts for every TMS station

## How to use:

1. Open the webpage and wait for the stations to load
2. Click station on map to see details and daily charts

## Development:

### Prerequisites:

- Node.js >16
- `pnpm` package manager installed

### Start development:

1. Install packages `pnpm install`
2. Start development server `pnpm dev`
3. UI running at `http://localhost:3000/` and API running at `http://localhost:3001/`

## Learn More:

- [About TMS data](https://www.digitraffic.fi/en/road-traffic/lam/)
- [Digitraffic API description](https://www.digitraffic.fi/en/road-traffic/)
