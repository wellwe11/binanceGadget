import { Activity, ReactNode, useEffect, useState } from "react";

import "../nav.css";
import ArrowSVG from "./assets/arrowSVG";

// Dropbar which displays all items
const FallMenu = ({
  children,
  showMenu,
  setShow,
  handler,
}: {
  showMenu: boolean;
  children: string[];
  setShow: (active: boolean) => void;
  handler: (n: number) => void;
}) => {
  const cleanInputHandler = (s: string) => s.replace("_", " ");

  const fallMenuItems = Array.isArray(children) ? children : [children];

  return (
    <Activity mode={showMenu ? "visible" : "hidden"}>
      <div
        className="absolute border_bg mt-0.5 flex flex-col max-h-50 overflow-y-scroll 
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        style={{ width: "100%" }}
      >
        {fallMenuItems.map((val: string, index) => (
          <button
            className="px-2 py-2.5 cursor-pointer hover:bg-gray-600"
            key={val + " " + index}
            onClick={() => {
              setShow(!showMenu);
              handler(index);
            }}
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
  const [inputVal, setInputVal] = useState(children);

  // Update inputs value
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;

    setInputVal(newVal);
  };

  // Search for matching child
  const handleSearch = () => {
    // Look for matching child
  };

  useEffect(() => {
    setInputVal(children);
  }, [children]);

  return (
    <input
      className="px-2 py-1 outline-none bg-transparent text-white text-s text-left font-extralight"
      style={{
        cursor: !canSearch ? "pointer" : "",
        width: "100%",
        height: "100%",
      }}
      readOnly={!canSearch}
      id="item_select"
      value={inputVal}
      onChange={(e) => {
        if (canSearch) {
          handleInput(e);
          handleSearch();
        }
      }}
    />
  );
};

const MainButton = ({
  handler,
  boolean,
}: {
  handler: () => void;
  boolean: boolean;
}) => {
  const rotateFlip = boolean ? "rotate(180deg)" : "rotate(0deg)";

  return (
    <button
      className="w-5 h-5 cursor-pointer flex items-center justify-center hover:bg-gray-600 rounded-sm"
      style={{ transition: "background-color 0.2s ease" }}
      onClick={handler}
    >
      <div
        className="transition-transform duration-250 ease-bounce"
        style={{
          transform: rotateFlip,
          height: "15px",
          width: "15px",
        }}
      >
        <ArrowSVG />
      </div>
    </button>
  );
};

// Top-level bar which displays currently selected item
const MainBar = ({
  children,
  canSearch,
  handler,
  boolean,
}: {
  children: string;
  canSearch?: boolean;
  boolean: boolean;
  handler: () => void;
}) => {
  return (
    <div
      className="border_bg flex items-center"
      style={{ height: "100%", width: "100%" }}
      onClick={() => {
        if (!canSearch) {
          handler();
        }
      }}
    >
      <div className="flex-1">
        <MainInput canSearch={canSearch}>{children}</MainInput>
      </div>
      <div className="pr-1">
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
  const [currentButton, setCurrentButton] = useState(() => value);
  const [expandBar, setExpandBar] = useState(false);
  const handleExpandBar = () => setExpandBar(!expandBar);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MainBar
        canSearch={canSearch}
        handler={handleExpandBar}
        boolean={expandBar}
      >
        {keys[currentButton]}
      </MainBar>

      <div className="relative w-inherit">
        <FallMenu
          setShow={setExpandBar}
          showMenu={expandBar}
          handler={setCurrentButton}
        >
          {keys}
        </FallMenu>
      </div>
    </div>
  );
};

export default DropdownMenu;
