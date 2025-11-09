export type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  init?: boolean;
};

export type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  type?: Exclude<ReactInputType, "radio" | "checkbox">;
};

export type TextAreaProps = React.ComponentPropsWithoutRef<"textarea">;

export type FormState = {
  success: boolean;
  error: string | null;
};
