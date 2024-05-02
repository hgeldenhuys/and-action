import { useActionData } from "@remix-run/react";

export type ActionGuardResult<T> = {
  valid: boolean | undefined;
  data: T | null;
};

export function useActionGuard<T = any>({
  validate,
  ignoreInvalid,
}: {
  validate: (data: T) => boolean;
  ignoreInvalid?: boolean;
}): ActionGuardResult<T> {
  const data = useActionData() as T;
  if (data === null || data === undefined)
    return { valid: undefined, data: null };
  const valid = validate(data);

  if (!valid && !ignoreInvalid) return { valid, data: null };

  return { valid, data };
}
