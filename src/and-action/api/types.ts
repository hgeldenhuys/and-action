import { ActionFunctionArgs } from "@remix-run/node";

export type ApiIntent = string;

export type DataObject = Record<string, any>;

export type ApiActionProps<CONTEXT extends DataObject = DataObject> = {
  actionArgs: ActionFunctionArgs;
  context: CONTEXT;
};

export type ApiAction<
  CONTEXT extends DataObject = DataObject,
  RESULT = DataObject,
> = (args: ApiActionProps<CONTEXT>) => Promise<RESULT>;

export type ActionMethod = "DELETE" | "PATCH" | "POST" | "PUT";

export type ApiResource<
  CONTEXT extends DataObject = DataObject,
  RESULT = DataObject,
> =
  | ApiAction<CONTEXT, RESULT>
  | Partial<Record<ActionMethod, ApiAction<CONTEXT, RESULT>>>;

export type ResourceApi<
  ROUTES extends ApiIntent = ApiIntent,
  CONTEXT extends DataObject = DataObject,
  RESULT = DataObject,
> = Record<ROUTES, ApiAction<CONTEXT, RESULT> | ApiResource<CONTEXT, RESULT>>;

export type DefaultApiResult = {
  data: object;
  errors?: string[];
  notifications?: string[];
};

export type DataValue = string | null | number | Date | boolean | undefined;

export type DataRecord = Record<
  string,
  DataValue | Record<string, DataValue> | DataValue[]
>;

export type DataResponse<T> = {
  data: T;
  error?: string;
  logs?: { title: string; message: string; level: "" }[];
};
