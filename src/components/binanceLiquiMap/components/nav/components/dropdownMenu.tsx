import { useState } from "react";

const FallMenu = () => {};

const MainInput = ({ children }: { children: string }) => {
  // Will update in future to handle more complex strings
  const cleanString = (s: string) => {
    return s.replace("_", " ");
  };

  return (
    <div>
      <input id="coin_select" type="input" value={children} />
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
