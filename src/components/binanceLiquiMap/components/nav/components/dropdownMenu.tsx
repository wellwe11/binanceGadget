import { ReactNode, useState } from "react";

const FallMenu = () => {};

const MainInput = ({ children }: { children: string }) => {
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

const MainBar = () => {
  return (
    <div className="flex">
      <MainInput>asd</MainInput>
      <MainButton />
    </div>
  );
};

const DropdownMenu = ({
  keys,
  value = 0,
}: {
  keys: string[];
  value: number;
}) => {
  const [currentButton, setCurrentButton] = useState(value);

  return (
    <div>
      <MainBar />
      <h1>Dropdown</h1>
    </div>
  );
};

export default DropdownMenu;
