export type IKeyValue<T> = {
  [key: string]: T;
};

export type INullAble<T> = T | null;

export type IPromiseOrType<T> = Promise<T> | T;
