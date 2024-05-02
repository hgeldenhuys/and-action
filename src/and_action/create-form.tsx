import { ActionIntent, DataObject, IntentionsForm } from "./types";
import { IntentForm } from "./IntentForm";

export function createForm<
  ROUTE extends ActionIntent,
  CONTEXT extends DataObject = DataObject,
>() {
  const MyIntentionsForm: IntentionsForm<ROUTE, CONTEXT> = IntentForm<
    ROUTE,
    CONTEXT
  >;
  return MyIntentionsForm;
}
