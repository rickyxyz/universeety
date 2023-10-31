# Universeety

A map based website to explore data from [Indonesia's National Higher Education Database](https://pddikti.kemdikbud.go.id/).

## The Idea

When I explored the data in [Indonesia's National Higher Education Database](https://pddikti.kemdikbud.go.id/), I though to myself

> Hmm, wouldn't it be more interesting if I can see the university data on a map instead of a boring list?

Then here it is, the realization of that idea is [universeety.fun](https://www.universeety.fun)

## The Process

```mermaid
---
title: Data Flow
---
flowchart TB
    id1[Indonesia's National Higher Education Webpage]
    id2[Custom webscrapping script]
    id3[Custom transformer and pipelines]
    id4[Universeety's PostgresSQL Database]
    id5[Universeety's Backend]
    id6[Universeety's Frontend]
    id1-- scrapped data -->id2
    id2-- .csv data -->id3
    id3-- cleaned data -->id4
    id4-- SQL data -->id5
    id5-- query result -->id6
    id6-- search query -->id5
```

### 1. Data mining

The data was mined using custom `python` and `selenium` script. The data is then transformed to fill in missing location (latitude, longitude) data using `Google Maps API`

### 2. Setting up the database and backend

The data is then stored to a `PostgresSQL` database and then served through a backend API built using `Django` and `Django Rest Framework`

### 3. Setting up the frontend

The frontend is built using `ReactJS` and `Google Map API`. The frontend's job is to send the user query to the backend API and serve the data on a map.

## The Result

![Landing Page](<images/landing page.png>)
The landing page of [universeety.fun](https://www.universeety.fun), here you can enter a search query to begin exploring higher education institution in Indonesia.

![Pin View](<images/map page.png>)
After entering the query, the map will show pins on the map denoting places that matches with the query.

![Heatmap View](<images/heatmap page.png>)
By clicking the floating button on the bottom left of the map view, the map can also be turned into a heatmap to show the density of mathces in each provinces in Indonesia.

![List View](<images/list page.png>)
A list view is also provided as an alternative to people who want to see it.
