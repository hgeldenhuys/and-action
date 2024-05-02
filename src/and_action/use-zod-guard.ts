import { z, ZodType, ZodTypeAny } from "zod";
import { useActionGuard } from "./use-action-guard";

type ZodGuardOptions<T> = {
  ignoreInvalid?: boolean;
} & ({ schema: ZodType<T> } | { sampleData: T });

export function inferZodSchema(obj: any): ZodTypeAny {
  const schema: Record<string, ZodTypeAny> = {};
  for (const key in obj) {
    console.log(key, obj[key]);
    if (obj[key] === undefined) {
      schema[key] = z.undefined().optional();
    } else if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      schema[key] = inferZodSchema(obj[key]); // Recursive call for nested objects
    } else if (Array.isArray(obj[key])) {
      schema[key] = z.array(inferZodSchema(obj[key][0])); // Assumes all array elements are of the same type
    } else {
      switch (typeof obj[key]) {
        case "string":
          schema[key] = z.string();
          break;
        case "number":
          schema[key] = z.number();
          break;
        case "boolean":
          schema[key] = z.boolean();
          break;
        default:
          schema[key] = z.any();
          break;
      }
    }
  }
  return z.object(schema);
}

export function useZodGuard<T = any>(props: ZodGuardOptions<T>) {
  const { schema, sampleData, ignoreInvalid } = {
    schema: null,
    sampleData: null,
    ...props,
  };
  const validate = schema ? schema : inferZodSchema(sampleData);

  return useActionGuard<T>({
    validate: (val) => {
      console.log({ validate }, validate.safeParse(val).error);
      return validate.safeParse(val).success;
    },
    ignoreInvalid,
  });
}
