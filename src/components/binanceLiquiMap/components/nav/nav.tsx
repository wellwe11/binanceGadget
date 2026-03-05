import { useState } from "react";
import "./nav.css";
import ClickMenu from "./UI/clickMenu";
import DropdownMenu from "./UI/dropdownMenu";
import MenuButton from "./components/menuButton";
import CameraSVG from "./UI/assets/cameraSVG";
import ResetSVG from "./UI/assets/resetSVG";
import DragInput from "./UI/dragInput";
import { Gradient } from "../gradient";
import { buttonColors, buttons, Pair_SymbolButtons } from "../../constants";
import { ObjectString, Setter } from "../../types";

type setShowArrayStringType = React.Dispatch<
  React.SetStateAction<liquidationType[]>
>;
type liquidationType = "Liquidation Leverage" | "Supercharts";

type setPairType = React.Dispatch<React.SetStateAction<string[]>>;

const SnapShotButton = () => {
  return (
    <div onClick={() => setRotation((prev) => prev + 180)}>
      <MenuButton>
        <div
          className="transition-transform duration-500 ease-bounce"
          style={{ height: "20px", color: "white" }}
        >
          <CameraSVG />
        </div>
      </MenuButton>
    </div>
  );
};

const ResetButton = ({ setRefreshGraph }) => {
  const [rotation, setRotation] = useState(0);

  return (
    <div
      className="flex gap-1 mx-1"
      onClick={() => setRotation((prev) => prev + 180)}
    >
      <MenuButton handler={() => setRefreshGraph((prev) => prev + 1)}>
        <div
          className="transition-transform duration-500 ease-bounce"
          style={{
            height: "20px",
            transform: `rotate(${rotation}deg)`,
            color: "white",
          }}
        >
          <ResetSVG />
        </div>
      </MenuButton>
    </div>
  );
};

const Slider = ({ threshold, setThreshold }) => {
  const handleDrag = (e: React.ChangeEvent<HTMLInputElement, Element>) => {
    const val = +e.target.value;
    setThreshold(val);
  };

  return (
    <div className="w-70 flex gap-3">
      <div className="flex-1">
        <DragInput value={threshold} setValue={handleDrag} />
      </div>
      <div className="flex items-center text-left" style={{ width: "60%" }}>
        <p
          className="text-white"
          style={{
            fontSize: "12px",
          }}
        >{`Liquidity Threshold = ${threshold < 100 ? "0." + threshold : 1}`}</p>
      </div>
    </div>
  );
};

const PairSymbolDropMenu = ({
  pairOrSymbol,
  setActiveCoin,
}: {
  pairOrSymbol: string[];
  setActiveCoin: (n: number) => void;
}) => {
  return (
    <div className="w-70">
      <DropdownMenu
        keys={pairOrSymbol}
        canSearch={false}
        handler={setActiveCoin}
      />
    </div>
  );
};

const TimeDropMenu = ({ times, setDays }: { time: Object[] }) => {
  return (
    <div className="w-30 mx-1">
      <DropdownMenu keys={times} canSearch={false} handler={setDays} />
    </div>
  );
};

const PairSymbolClickMenu = ({ setter }: { setter: (n: number) => void }) => {
  return <ClickMenu onSelect={setter}>{Pair_SymbolButtons}</ClickMenu>;
};

const GraphTypeControllerMenu = ({
  arr,
  setter,
}: {
  arr: liquidationType[];
  setter: setShowArrayStringType;
}) => {
  const handleEvent = (n: liquidationType) => {
    if (!arr.includes(n)) {
      return setter((prev) => [...prev, n]);
    }

    const filtered = arr.filter((name) => name !== n);

    setter(filtered);
  };

  return (
    <div className="flex gap-5">
      {buttons.map(
        (
          { name, color }: { name: liquidationType; color: string },
          index: number,
        ) => {
          const isActive = arr.includes(name);
          return (
            <button
              key={index + " " + name}
              onClick={() => handleEvent(name)}
              className="flex gap-1 justify-center items-center cursor-pointer"
            >
              <div className="relative w-2.5 h-2.5">
                <div
                  className="absolute h-2.5 w-2.5 z-1"
                  style={{
                    backgroundColor: "gray",
                    transition: "background-color 0.15s ease",
                  }}
                />
                <div
                  className="absolute h-2.5 w-2.5 z-2"
                  style={{
                    backgroundColor: color,
                    transform: `scale(${isActive ? "1" : "0"})`,
                    transformOrigin: "center",
                    transition: `transform ${isActive ? "0.3" : "0.2"}s ease`,
                  }}
                />
              </div>
              <p className="text-white" style={{ fontSize: "12px" }}>
                {name}
              </p>
            </button>
          );
        },
      )}
    </div>
  );
};

const DisplayLiquidationButton = ({ setter }) => {
  const handleChecked = (e) => {
    const isChecked = e.target.checked;

    setter(isChecked);
  };
  return (
    <div className="flex items-center gap-2.5">
      <p className="text-white">Liquidation Map</p>
      <input
        onChange={handleChecked}
        type="checkbox"
        className="w-5 h-5 bg-amber-300 cursor-pointer"
      />
    </div>
  );
};

const ThemeSelection = ({ setColorTheme }) => {
  return (
    <div className="flex gap-2">
      {buttonColors.map(({ name, baseColor }, index) => (
        <button
          className="w-5 h-5 cursor-pointer"
          key={index}
          onClick={() => setColorTheme({ name, color: baseColor })}
        >
          <Gradient colorTheme={name} />
        </button>
      ))}
    </div>
  );
};

const Nav = ({
  times,
  displayMap,
  setColorTheme,
  setThreshold,
  threshold,
  showCharts,
  setShowCharts,
  setRefreshGraph,
  setDays,
  pairOrSymbol,
  setPairOrSymbol,
  activeCoin,
  setActiveCoin,
}: {
  times: string[];
  displayMap: Setter<boolean>;
  setColorTheme: Setter<ObjectString>;
  setThreshold: Setter<number>;
  threshold: number;
  showCharts: string[];
  setShowCharts: Setter<string[]>;
  setRefreshGraph: Setter<number>;
  setDays: Setter<number>;
  pairOrSymbol: string[];
  setPairOrSymbol: (n: number) => void;
  activeCoin: number;
  setActiveCoin: (n: number) => void;
}) => {
  return (
    <div className="w-full flex flex-col min-[500px]:flex-row justify-between px-2 py-1 flex-wrap">
      <div className="flex-1">
        <div className="flex flex-col">
          <div className="generic_height w-32">
            <PairSymbolClickMenu setter={setPairOrSymbol} />
          </div>
          <div className="hidden min-[1000px]:block">
            <h4
              style={{
                fontSize: "28px",
                fontVariationSettings: "'wght' 550",
                color: "white",
              }}
            >
              {activeCoin + " Heatmap" || "Please add title"}
            </h4>
            <p className="text-white max-w-100 text-wrap text-xs font-extralight py-1">
              This heatmap is still in under development. Data is directly
              created inside of the component. This may cause unpredictable
              behaviour. With live data, this will be resolved.
            </p>
            <p className="text-gray-300 max-w-100 text-wrap text-xs font-extralight py-1">
              If data looks 'odd', please click the refresh-button found on the
              right-hand side of the navigational bar.
            </p>
            <p className="text-gray-400 max-w-100 text-wrap text-xs font-extralight py-1">
              Snapshot is currently disabled.
            </p>
          </div>
        </div>
      </div>

      <div className=" flex flex-col items-end justify-between">
        <div className="generic_height flex items-center justify-end">
          <div className="flex flex-1 flex-wrap z-3">
            <TimeDropMenu times={times} setDays={setDays} />
            <PairSymbolDropMenu
              pairOrSymbol={pairOrSymbol}
              setActiveCoin={setActiveCoin}
            />
          </div>
        </div>

        <div className="flex  justify-end gap-5">
          <div className="flex flex-col gap-5 py-2 ">
            <div className="generic_height flex justify-end pr-3">
              <ResetButton setRefreshGraph={setRefreshGraph} />
              <SnapShotButton />
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <ThemeSelection setColorTheme={setColorTheme} />
              <Slider setThreshold={setThreshold} threshold={threshold} />
            </div>
            <div className="flex gap-2.5">
              <GraphTypeControllerMenu
                arr={showCharts}
                setter={setShowCharts}
              />
              <DisplayLiquidationButton setter={displayMap} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
