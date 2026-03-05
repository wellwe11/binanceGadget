export type booleanSetter = React.Dispatch<React.SetStateAction<boolean>>;

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export type ColorTheme = {
  name: string;
  color: string;
};
