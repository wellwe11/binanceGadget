import { useState } from "react";
import "./nav.css";
import ClickMenu from "./UI/clickMenu";
import DropdownMenu from "./UI/dropdownMenu";
import MenuButton from "./components/menuButton";
import CameraSVG from "./UI/assets/cameraSVG";
import ResetSVG from "./UI/assets/resetSVG";
import DragInput from "./UI/dragInput";

// In this document you'll find wrappers, as well as the complete Nav component.
// Each wrapper contains the general styling such as width, height etc.
// Each wrapper handles it's own logic
// Each wrapper has abstract and un-direct components

const Reset_and_Snapshot = () => {
  const [rotation, setRotation] = useState(0);

  return (
    <div className="generic_height flex gap-1 mx-1">
      <MenuButton>
        <div className="" style={{ height: "20px", color: "white" }}>
          <CameraSVG />
        </div>
      </MenuButton>
      <div onClick={() => setRotation((prev) => prev + 180)}>
        <MenuButton>
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
    </div>
  );
};

const Slider = () => {
  const [dragVal, setDragVal] = useState(60);
  const handleDrag = (e: React.ChangeEvent<HTMLInputElement, Element>) => {
    const val = +e.target.value;
    setDragVal(val);
  };
  return (
    <div className="w-70 flex gap-3">
      <div className="flex-1">
        <DragInput value={dragVal} setValue={handleDrag} />
      </div>
      <div className="flex items-center text-left" style={{ width: "60%" }}>
        <p
          style={{
            fontSize: "12px",
          }}
        >{`Liquidity Threshold = ${dragVal < 100 ? "0." + dragVal : 1}`}</p>
      </div>
    </div>
  );
};

const PairSymbolDropMenu = ({ pairOrSymbol }: { pairOrSymbol: string[] }) => {
  return (
    <div className="w-70">
      <DropdownMenu keys={pairOrSymbol} />
    </div>
  );
};

const TimeDropMenu = ({ time }: { time: Object[] }) => {
  return (
    <div className="w-30 mx-1">
      <DropdownMenu keys={Object.keys(time)} canSearch={false} />
    </div>
  );
};

const PairSymbolClickMenu = ({
  pair,
  symbol,
  setter,
}: {
  symbol: string[];
  pair: string[];
  setter: (e: string[]) => void;
}) => {
  const Pair_SymbolButtons = ["Pair", "Symbol"];
  const pairOrSymbolArr = [pair, symbol];

  const handleSelectPairOrSymbol = (index: number) => {
    setter(pairOrSymbolArr[index]);
  };

  return (
    <div className="generic_height">
      <ClickMenu onSelect={handleSelectPairOrSymbol}>
        {Pair_SymbolButtons}
      </ClickMenu>
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
  const [pairOrSymbol, setPairOrSymbol] = useState(pair);

  return (
    <div className="flex">
      <PairSymbolClickMenu
        pair={pair}
        symbol={symbol}
        setter={setPairOrSymbol}
      />
      <TimeDropMenu time={time} />
      <PairSymbolDropMenu pairOrSymbol={pairOrSymbol} />
      <Reset_and_Snapshot />
      <Slider />
    </div>
  );
};

export default Nav;
