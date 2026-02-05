import { useState } from "react";

const Button = () => {};

const FallMenu = () => {};

const MainButton = ({ children = "Default" }: { children?: string }) => {
  // Will update in future to handle more complex strings
  const cleanString = (s: string) => {
    return s.replace("_", " ");
  };

  return (
    <button>
      <p>{cleanString(children)}</p>
    </button>
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
      <MainButton>{keys[currentButton]}</MainButton>
      <h1>Dropdown</h1>
    </div>
  );
};

export default DropdownMenu;
