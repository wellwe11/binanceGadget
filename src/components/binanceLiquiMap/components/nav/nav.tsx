import { useState } from "react";
import "./nav.css";

const Pair_Symbol = () => {
  const [activeButton, setActiveButton] = useState(true);
  const [scaleOn, setScaleOn] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState(false);

  const handleTransform = () => setTransformOrigin(!transformOrigin);

  const handleButton = () => {
    handleScale();
    handleTransform();
    setTimeout(() => {
      setActiveButton(!activeButton);
    }, 50);
  };
  const handleScale = () => {
    setScaleOn(true);

    setTimeout(() => {
      setScaleOn(false);
    }, 175);
  };

  const buttonStyle =
    "z-10 py-3.75 w-16 text-gray-200 cursor-pointer bg-gray-500 hover:bg-gray-400";
  const buttonTextStyle =
    "absolute z-13 top-1.75 text-gray-200 pointer-events-none";

  return (
    <div className="relative flex w-fit p-1 rounded-md overflow-hidden bg-gray-600">
      <p
        className={`left-5.5 ${buttonTextStyle}`}
        style={{
          color: !activeButton ? "rgb(228, 228, 228)" : "",
          transition: "color 0.3s ease",
        }}
      >
        Pair
      </p>

      <button
        className={`rounded-l-md ${buttonStyle}`}
        onClick={() => !activeButton && handleButton()}
      />

      <div
        className="z-11 absolute top-1 py-3.75 w-16 bg-gray-600 hover:bg-gray-600 pointer-events-auto cursor-pointer"
        style={{
          transformOrigin: !transformOrigin ? "right" : "left",
          transform: `translateX(${activeButton ? "0" : "100%"}) scaleX(${scaleOn ? "1.3" : "1"})`,
          transition: "transform 0.2s ease",
        }}
      />
      <p
        className={`right-2 ${buttonTextStyle}`}
        style={{
          color: activeButton ? "rgb(228, 228, 228)" : "",
          transition: "color 0.3s ease",
        }}
      >
        Symbol
      </p>

      <button
        className={`rounded-r-md ${buttonStyle}`}
        onClick={() => activeButton && handleButton()}
      />
    </div>
  );
};

const Nav = () => {
  /** navbar
  
  
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
  
  
  Drop-down menu with
  times
  1 year
  6 month
  3 month
  1 month
  2 week
  1 week
  3 day
  48 hour
  24 hour

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

  return (
    <div>
      <Pair_Symbol />
    </div>
  );
};

export default Nav;
