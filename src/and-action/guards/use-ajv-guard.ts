import Ajv from "ajv";
import { useActionGuard } from "./use-action-guard";

type AjvGuardOptions<T> = {
  ignoreInvalid?: boolean;
} & ({ schema: object } | { sampleData: T });

export function inferAjvSchema(obj: any): any {
  let schema: any = { type: "object", properties: {}, required: [] };

  for (const key in obj) {
    schema.properties[key] = generateSchemaForValue(obj[key]);
    schema.required.push(key);
  }

  return schema;
}

function generateSchemaForValue(value: any): any {
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      // Assumes all elements are of the same type, and takes the first item to determine the type
      return { type: "array", items: generateSchemaForValue(value[0]) };
    } else {
      // Recursive call for nested objects
      return inferAjvSchema(value);
    }
  } else {
    switch (typeof value) {
      case "string":
        return { type: "string" };
      case "number":
        return { type: "number" };
      case "boolean":
        return { type: "boolean" };
      default:
        return { type: "null" };
    }
  }
}

export function useAjvGuard<T = any>(props: AjvGuardOptions<T>) {
  const { schema, sampleData, ignoreInvalid } = {
    schema: null,
    sampleData: null,
    ...props,
  };
  const validationSchema = schema ? schema : inferAjvSchema(sampleData);
  const ajv = new Ajv();
  const validate = ajv.compile(validationSchema);

  return useActionGuard<T>({
    validate: (val) => {
      const validated = validate(val);
      const error = validate.errors;
      if (Array.isArray(error)) error.forEach((error) => console.error(error));
      const formErrors: string[] = [];
      const fieldErrors:
        | Record<string | number | symbol, string[] | undefined>
        | undefined = error?.reduce(
        (acc, error) => {
          if (error.dataPath) {
            const field = error.dataPath.slice(1);
            const fieldError = acc[field] || [];
            if (error.message) fieldError.push(error.message);
            acc[field] = fieldError;
          }
          return acc;
        },
        {} as Record<string | number | symbol, string[] | undefined>,
      );
      return {
        valid: !!validated,
        data: val,
        fieldErrors,
        payloadErrors: formErrors,
      };
    },
    ignoreInvalid,
  });
}
