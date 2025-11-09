export type ButtonType = "submit" | "edit" | "delete" | "common";

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonType;
  children: React.ReactNode;
};

export type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  type?: Exclude<ReactInputType, "radio" | "checkbox">;
};

export type TextAreaProps = React.ComponentPropsWithoutRef<"textarea">;

export type FormState = {
  success: boolean;
  error: string | null;
};
