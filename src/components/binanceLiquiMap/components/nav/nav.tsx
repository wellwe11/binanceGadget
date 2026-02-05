import { useState } from "react";
import "./nav.css";
import ClickMenu from "./components/clickMenu";
import DropdownMenu from "./components/dropdownMenu";

const Nav = ({
  symbol,
  pair,
  time,
}: {
  symbol: string[];
  pair: string[];
  time: Object[];
}) => {
  /** navbar
  

  // coins: Symbol
  // 

  
  Pair/Symbol button
  This updates the type of data
  Pair: Binance BTC/USDT Perpetual
  Symbol: BTC
  
  
  Drop-down menu with
  type of data:
  -- Binance BTC/USDT Perpetual
  -- MEXC BTC/USDT Perpetual
  -- Gate BTC/USDT Perpetual
  etc.
  
  
  A reset button 
  Refreshes the chart

  A printscreen button 
  Downloads a snapshot of the chart


  Pull-bar
  name: Liquidity Threshold = n
  Goes from 0.1 - 1


  Liquidation map
  Displays a new chart on the right side with a 'Hyperlioquid whale tracker'
 */

  const Pair_SymbolButtons = ["Pair Symbol", "random", "random3"];

  return (
    <div>
      <ClickMenu>{Pair_SymbolButtons}</ClickMenu>
      <DropdownMenu keys={Object.keys(time)} />
    </div>
  );
};

export default Nav;
