import { useActionData } from "@remix-run/react";

export type ValidationResult = {
  valid: boolean | undefined;
  payloadErrors?: string[];
  fieldErrors?: Record<string | number | symbol, string[] | undefined>;
};

export type ActionGuardResult<T> = ValidationResult & {
  data: T | null;
};

export function useActionGuard<T = any>({
  validate,
  ignoreInvalid,
}: {
  validate: (data: T) => ValidationResult;
  ignoreInvalid?: boolean;
}): ActionGuardResult<T> {
  const actionData = useActionData() as T;
  console.log({ actionData });
  if (actionData === null || actionData === undefined)
    return { valid: undefined, data: null };
  const { valid, fieldErrors, payloadErrors } = validate(actionData);

  if (!valid && !ignoreInvalid)
    return { valid, fieldErrors, payloadErrors, data: null };

  return { valid, fieldErrors, payloadErrors, data: actionData };
}
