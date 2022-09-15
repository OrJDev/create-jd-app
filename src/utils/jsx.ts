export const getStyle = (useTW: boolean, style: string) =>
  useTW ? ` className="${style}"` : "";
