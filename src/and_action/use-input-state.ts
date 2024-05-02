import { ChangeEvent, useState } from "react";

export function useTextInputState<T extends string = string>(init: T) {
  const [state, setState] = useState<T>(init);
  return [
    state,
    (e: ChangeEvent<HTMLInputElement>) => setState((e.target.value || "") as T),
  ] as const;
}

export function useNumberInputState<T extends number = number>(init: T) {
  const [state, setState] = useState<T>(init);
  return [
    state,
    (e: ChangeEvent<HTMLInputElement>) =>
      setState(parseInt(e.target.value || "0") as T),
  ] as const;
}
