import { useState } from "react";
import "./nav.css";
import ClickMenu from "./UI/clickMenu";
import DropdownMenu from "./UI/dropdownMenu";
import MenuButton from "./components/menuButton";
import CameraSVG from "./UI/assets/cameraSVG";
import ResetSVG from "./UI/assets/resetSVG";

const Reset_and_Snapshot = () => {
  const [rotation, setRotation] = useState(0);

  console.log(rotation);

  return (
    <div className="generic_height flex gap-1 mx-1">
      <MenuButton>
        <div className="" style={{ height: "20px", color: "white" }}>
          <CameraSVG />
        </div>
      </MenuButton>
      <MenuButton>
        <div
          className="transition-transform duration-500 ease-bounce"
          style={{
            height: "20px",
            transform: `rotate(${rotation}deg)`,
            color: "white",
          }}
          onClick={() => setRotation((prev) => prev + 180)}
        >
          <ResetSVG />
        </div>
      </MenuButton>
    </div>
  );
};

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
      <div className="w-30 mx-1">
        <DropdownMenu keys={Object.keys(time)} canSearch={false} />
      </div>
      <div className="w-70">
        <DropdownMenu keys={pair} />
      </div>

      <Reset_and_Snapshot />
    </div>
  );
};

export default Nav;
