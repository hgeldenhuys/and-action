import { deserialize, SuperJSONResult } from "superjson";
import { DataRecord } from "./api/types";
import { Children, isValidElement, ReactElement, ReactNode } from "react";

export function mergeFormDataWithJson(
  entries: IterableIterator<[string, FormDataEntryValue | string | boolean]>,
  meta: SuperJSONResult,
) {
  const json = meta.json || ({ json: {} } as SuperJSONResult["json"]);

  for (const [key, value] of entries) {
    if (key === "intent" || key === "__meta" || !key) continue;
    if (value !== null) {
      const json = meta.json as Record<string, any>;
      const metaType = (meta.meta?.values as never)?.[key]?.[0];
      const jsonType = typeof json[key];
      const formType = typeof value;
      const type: string =
        metaType === undefined
          ? jsonType === "undefined"
            ? formType
            : jsonType
          : metaType;

      const vals = json as never as DataRecord;

      switch (type) {
        case "string":
          vals[key] = value as string;
          break;
        case "number":
          vals[key] = Number(value) as number;
          break;
        case "boolean":
          vals[key] = value === "on" || value === "true";
          break;
        case "object":
          // vals[key] = JSON.parse(value as string);
          if (Array.isArray(vals[key]))
            if (isNaN((vals[key] as any)[0]))
              vals[key] = (value as string).split(",");
            else vals[key] = (value as string).split(",").map(Number);
          else
            try {
              vals[key] = JSON.parse(value as string);
            } catch (e) {
              console.debug("JSON.parse error", e, value);
            }
          break;
        case "Date":
          vals[key] = new Date(value as string);
          break;
        default:
          vals[key] = value as string;
      }
    }
  }
  meta.json = json;
  return deserialize<DataRecord>(meta);
}

export function deepEqual<T extends DataRecord>(object1: T, object2: T) {
  if (object1 === object2) {
    return true;
  }

  if (
    (object1 as unknown) instanceof Date &&
    (object2 as unknown) instanceof Date
  ) {
    return object1.toString() === object2.toString();
  }
  if (
    typeof object1 !== "object" ||
    object1 === null ||
    typeof object2 !== "object" ||
    object2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    if (!deepEqual(object1[key] as T, object2[key] as T)) {
      return false;
    }
  }

  return true;
}

export function findSubmitButtons(children: ReactNode) {
  let submitButtons: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === "button" && child.props.type === "submit") {
        submitButtons.push(child);
      }

      if (child.props.children) {
        submitButtons = submitButtons.concat(
          findSubmitButtons(child.props.children),
        );
      }
    }
  });

  return submitButtons;
}
