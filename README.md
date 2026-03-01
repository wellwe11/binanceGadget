# BinanceGadget: Liquidation Heatmap

A heatmap that tracks current price of specific coins and related liquidations.

## TODO

- Zoom-effect
- Abstract data-filtering
- Adapt code for Binance WebSocket API
- Color-theme choice
- Wire 'navbar buttons' to graphs
- Wire timeLapsChart to allow control over timestamps

## Related projects

[Liquidation heatmap](https://github.com/wellwe11/graph) - A heatmap that shows liquidations; initial learning-project for d3.js.

## Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS
- **Data Visualization:** D3.js (Custom Heatmap & Graphs)
- **Language:** TypeScript

## Features

- **Live Data Simulation:** Generates and processes data structures mirroring the Coinbase API.
- **Volume Accumulation:** Calculates and aggregates trading volumes to identify "walls" of liquidity.
- **Dynamic D3 Rendering:** Custom-built Heatmap and price charts that react to data changes in real-time.
- **Liquidation Tracking:** Visualizes potential liquidation levels to predict price reversals.

## Getting Started

### 1. Clone the repo

`git clone https://github.com/wellwe11/binanceGadget`

### 2. Install dependencies

`npm install`

### 3. Run the project

`npm run dev`

## Project Context

This project is part of my internship at **Coin360**.
I've used the [Coinglass graph](https://www.coinglass.com/pro/futures/LiquidationHeatMap?coin=BTC&type=pair) as inspiration for styling and data visualization.
