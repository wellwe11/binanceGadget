import { ReactNode, useState } from "react";

const FallMenu = () => {};

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

const MainButton = () => {
  return <button>V</button>;
};

const MainBar = ({ canSearch }: { canSearch?: boolean }) => {
  return (
    <div className="flex">
      <MainInput canSearch={canSearch}>asd</MainInput>
      <MainButton />
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

  return (
    <div>
      <MainBar canSearch={canSearch} />
      <h1>Dropdown</h1>
    </div>
  );
};

export default DropdownMenu;
