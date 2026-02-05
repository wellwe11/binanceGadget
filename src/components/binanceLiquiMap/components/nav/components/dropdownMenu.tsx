import { ReactNode, useState } from "react";

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
    <div className="flex flex-col bg-amber-200">
      {fallMenuItems.map((val: string) => (
        <button key={val}>{cleanInputHandler(val)}</button>
      ))}
    </div>
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
      className="w-full px-2 outline-none bg-transparent"
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

const MainButton = ({ handler }) => {
  return (
    <button className="px-1 cursor-pointer" onClick={handler}>
      V
    </button>
  );
};

const MainBar = ({ canSearch, handler }: { canSearch?: boolean }) => {
  return (
    <div className="flex bg-amber-500">
      <div className="relevant w-[80%]">
        <MainInput canSearch={canSearch}>asd</MainInput>
      </div>
      <div className="w-[20%]">
        <MainButton handler={handler} />
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
      <MainBar canSearch={canSearch} handler={handleExpandBar} />
      <FallMenu showMenu={expandBar}>{keys}</FallMenu>
    </div>
  );
};

export default DropdownMenu;
