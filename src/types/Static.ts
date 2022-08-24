export type IKeyValue<T = string> = {
  [key: string]: T;
};

export type INullAble<T> = T | null;
