import { ApiIntent, DataObject } from "../api/types";
import { ApiForm } from "./ApiForm";
import { ApiFormType } from "./types";

export function createForm<
  ROUTE extends ApiIntent,
  CONTEXT extends DataObject = DataObject,
  RESULT = DataObject,
>() {
  const MyIntentionsForm: ApiFormType<ROUTE, CONTEXT, RESULT> = ApiForm<
    ROUTE,
    CONTEXT,
    RESULT
  >;
  return MyIntentionsForm;
}
