import { useState } from "react";
import "./nav.css";
import ClickMenu from "./UI/clickMenu";
import DropdownMenu from "./UI/dropdownMenu";
import MenuButton from "./components/menuButton";

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

  const Pair_SymbolButtons = ["Pair", "Symbol"];

  return (
    <div className="flex">
      <div className="generic_height">
        <ClickMenu>{Pair_SymbolButtons}</ClickMenu>
      </div>
      <div className="w-30">
        <DropdownMenu keys={Object.keys(time)} canSearch={false} />
      </div>
      <div className="w-70">
        <DropdownMenu keys={pair} />
      </div>

      <div className="generic_height">
        <MenuButton>Hello</MenuButton>
      </div>
    </div>
  );
};

export default Nav;
