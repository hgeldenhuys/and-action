import { SuperJSONResult } from "superjson";
import {
  ResourceApi,
  ActionMethod,
  ApiIntent,
  DataRecord,
  DefaultApiResult,
  DataObject,
} from "./types";
import { mergeFormDataWithJson } from "../helpers";
import { ActionFunctionArgs, TypedResponse } from "@remix-run/node";

export function routeActionBuilder<
  ROUTES extends ApiIntent = ApiIntent,
  CONTEXT extends DataRecord = DataRecord,
  ACTIONS extends ResourceApi<ROUTES, CONTEXT> = ResourceApi<ROUTES, CONTEXT>,
  RESULT = DefaultApiResult,
>(intents: ACTIONS) {
  const action = async (
    actionArgs: ActionFunctionArgs,
  ): Promise<RESULT | { error: string }> => {
    const formData = await actionArgs.request.formData();
    const method = actionArgs.request.method as ActionMethod;
    const intent = formData.get("intent") as ROUTES;
    const meta = JSON.parse(
      formData.get("__meta") as string,
    ) as SuperJSONResult;
    const context = mergeFormDataWithJson(formData.entries(), meta) as CONTEXT;

    if (!intent)
      return {
        error: `No intent found in form data or params: "${intent}"`,
      };

    const action = intents[intent];
    if (!action)
      return {
        error: `No action found for intent: "${intent}"`,
      };

    if (typeof action === "function") {
      return (await action({ actionArgs, context })) as RESULT;
    } else {
      const route = action[method];
      if (!route)
        return {
          error: `No route found for method "${method}" in intent "${intent}"`,
        };
      return (await route({ actionArgs, context })) as RESULT;
    }
  };
  action.intents = intents;
  return action;
}

export function createApiRoutes<
  ROUTE extends ApiIntent,
  CONTEXT extends DataObject = DataObject,
  RESULT = TypedResponse<object>,
  ACTIONS extends ResourceApi<ROUTE, CONTEXT, RESULT> = ResourceApi<
    ROUTE,
    CONTEXT,
    RESULT
  >,
>(routes: ACTIONS) {
  const use = (props?: { onInit: (intents: ACTIONS) => void }) => {
    const { onInit } = props || {};
    onInit?.(routes);
    return routeActionBuilder(routes as ResourceApi<string>);
  };
  return {
    use,
    routes,
  };
}
