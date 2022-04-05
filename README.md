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

- Node.js >10

### Backend:

**Start development**

1. Install yarn packages `yarn install`
2. Start development server `yarn watch`
3. Server running at `http://localhost:3001/`

### Frontend:

**Start development**

1. Install yarn packages `yarn install`
2. Start development server `yarn start`
3. Server running at `http://localhost:3000/`

## Learn More:

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [About TMS data](https://www.digitraffic.fi/en/road-traffic/lam/)
- [Digitraffic API description](https://www.digitraffic.fi/en/road-traffic/)
