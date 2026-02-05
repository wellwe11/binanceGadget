import { Activity, ReactNode, useState } from "react";

import "../nav.css";
import ArrowSVG from "./assets/arrowSVG";

// Dropbar which displays all items
const FallMenu = ({
  children,
  showMenu,
}: {
  showMenu: boolean;
  children: string[];
}) => {
  const cleanInputHandler = (s: string) => s.replace("_", " ");

  const fallMenuItems = Array.isArray(children) ? children : [children];

  return (
    <Activity mode={showMenu ? "visible" : "hidden"}>
      <div
        className="border_bg mt-0.5 flex flex-col max-h-50 overflow-y-scroll 
  
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        {fallMenuItems.map((val: string) => (
          <button
            className="px-2 py-2.5 cursor-pointer hover:bg-gray-600"
            key={val}
          >
            <p className="text-white text-xs text-left font-extralight">
              {cleanInputHandler(val)}
            </p>
          </button>
        ))}
      </div>
    </Activity>
  );
};

const MainInput = ({
  children,
  canSearch = true,
}: {
  children: string;
  canSearch?: boolean;
}) => {
  const [inputVal, setInputVal] = useState(() => children);

  // Update inputs value
  const handleInput = (e) => {
    const newVal = e.target.value;

    setInputVal(newVal);
  };

  // Search for matching child
  const handleSearch = () => {
    // Look for matching child
  };

  return (
    <input
      className="w-full px-2 py-1 outline-none bg-transparent text-white text-s text-left font-extralight"
      readOnly={!canSearch}
      id="coin_select"
      value={inputVal}
      onChange={(e) => {
        handleInput(e);
        handleSearch();
      }}
    />
  );
};

const MainButton = ({ handler, boolean }) => {
  const rotateFlip = boolean ? "rotate(180deg)" : "rotate(0deg)";

  return (
    <button
      className="px-1 py-1 h-inherit w-inherit cursor-pointer flex items-center justify-center hover:bg-gray-600"
      style={{ transition: "background-color 0.2s ease" }}
      onClick={handler}
    >
      <div
        style={{
          transform: rotateFlip,
          transition: "transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6)",
        }}
      >
        <ArrowSVG />
      </div>
    </button>
  );
};

// Top-level bar which displays currently selected item
const MainBar = ({
  canSearch,
  handler,
  boolean,
}: {
  canSearch?: boolean;
  boolean: boolean;
}) => {
  return (
    <div className="border_bg flex items-center">
      <div className="relevant w-[80%]">
        <MainInput canSearch={canSearch}>asd</MainInput>
      </div>
      <div className="w-[20%] h-max">
        <MainButton boolean={boolean} handler={handler} />
      </div>
    </div>
  );
};

const DropdownMenu = ({
  keys,
  value = 0,
  canSearch = true,
}: {
  keys: string[];
  value?: number;
  canSearch?: boolean;
}) => {
  const [currentButton, setCurrentButton] = useState(value);
  const [expandBar, setExpandBar] = useState(false);
  const handleExpandBar = () => setExpandBar(!expandBar);

  return (
    <div className="w-40">
      <MainBar
        canSearch={canSearch}
        handler={handleExpandBar}
        boolean={expandBar}
      />
      <FallMenu showMenu={expandBar}>{keys}</FallMenu>
    </div>
  );
};

export default DropdownMenu;
