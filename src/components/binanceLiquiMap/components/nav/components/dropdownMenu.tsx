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
    <div>
      <input
        readOnly={!canSearch}
        id="coin_select"
        type="input"
        value={inputVal}
        onChange={(e) => {
          handleInput(e);
          handleSearch();
        }}
      />
    </div>
  );
};

const MainButton = ({ handler }) => {
  return <button onClick={handler}>V</button>;
};

const MainBar = ({ canSearch, handler }: { canSearch?: boolean }) => {
  return (
    <div className="flex">
      <MainInput canSearch={canSearch}>asd</MainInput>
      <MainButton handler={handler} />
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
