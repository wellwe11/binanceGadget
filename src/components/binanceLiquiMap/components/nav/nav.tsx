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
    }, 100);
  };

  const buttonStyle =
    "card-shadow z-10 h-7.5 w-16 text-gray-200 cursor-pointer bg-gray-600";
  const buttonTextStyle =
    "absolute z-13 top-1.75 text-gray-200 pointer-events-none";

  return (
    <div className="card-shadow relative flex w-fit p-1 rounded-xl bg-gray-600 border-4 border-gray-700">
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
        className={`rounded-l-xl ${buttonStyle}`}
        onClick={() => !activeButton && handleButton()}
      />

      <div
        className={`inner-shadow z-11 absolute top-1 py-3.75 w-16 bg-gray-700 pointer-events-auto cursor-pointer`}
        style={{
          transformOrigin: !transformOrigin ? "right" : "left",
          transform: `translateX(${activeButton ? "0" : "100%"}) scaleX(${scaleOn ? "1.6" : "1"})`,
          transition: "transform 0.2s ease, border-radius 0.2s ease",

          borderTopLeftRadius: activeButton ? "12px" : "0px",
          borderBottomLeftRadius: activeButton ? "12px" : "0px",

          borderTopRightRadius: !activeButton ? "12px" : "0px",
          borderBottomRightRadius: !activeButton ? "12px" : "0px",
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
        className={`rounded-r-xl ${buttonStyle}`}
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
