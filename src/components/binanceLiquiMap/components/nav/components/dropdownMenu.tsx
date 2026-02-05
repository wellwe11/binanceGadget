import { useState } from "react";

const FallMenu = () => {};

const MainInput = ({ children }: { children: string }) => {
  const [inputVal, setInputVal] = useState(() => children);

  const handleInput = (e) => {
    const newVal = e.target.value;

    setInputVal(newVal);
  };

  return (
    <div>
      <input
        id="coin_select"
        type="input"
        value={inputVal}
        onChange={handleInput}
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
