import type { ApiIntent, DefaultApiResult } from "../api/types";
import { MutableRefObject, ReactElement, ReactNode } from "react";
import { FormProps } from "@remix-run/react";

export type ApiFormRenderComponentProps<CONTEXT, RESULT> = {
  intent: ApiIntent;
  defaultContext?: CONTEXT;
  context?: CONTEXT;
  ref?: MutableRefObject<HTMLFormElement | undefined>;
  actionData: RESULT | null;
  children?: ReactNode;
  valid: boolean;
  changed: boolean;
};

export type ApiFormRenderComponent<
  CONTEXT extends any = DefaultApiResult,
  RESULT extends any = DefaultApiResult,
> = (props: ApiFormRenderComponentProps<CONTEXT, RESULT>) => ReactNode;

export type ContextValidationFunction<CONTEXT extends any = DefaultApiResult> =
  ({
    defaultContext,
    values,
    changed,
  }: {
    defaultContext: CONTEXT;
    values: CONTEXT;
    changed: boolean;
  }) => boolean;

export type ApiFormProps<ROUTE extends ApiIntent, CONTEXT, RESULT> = Omit<
  FormProps,
  "children"
> & {
  children?: ReactNode | ApiFormRenderComponent<CONTEXT, RESULT>;
  intent: ROUTE;
  defaultContext?: CONTEXT;
  ref?: MutableRefObject<HTMLFormElement | undefined>;
  invalid?: boolean | ContextValidationFunction<CONTEXT>;
  withTracking?: boolean;
  withFetcher?: boolean;
  withoutIntent?: boolean;
  withProvider?: boolean;
};

export type ApiFormComponent<ROUTE extends ApiIntent, CONTEXT, RESULT> = (
  props: ApiFormProps<ROUTE, CONTEXT, RESULT>,
) => ReactElement;

export type ApiFormType<
  ROUTE extends ApiIntent,
  CONTEXT,
  RESULT,
> = ApiFormComponent<ROUTE, CONTEXT, RESULT>;
