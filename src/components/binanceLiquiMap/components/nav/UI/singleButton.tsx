import Button from "../components/menuButton";

import "../nav.css";

const SingleButton = ({ children }: { children: string }) => {
  return (
    <div className="generic_height bg-amber-100">
      <Button>{children}</Button>
    </div>
  );
};

export default SingleButton;
