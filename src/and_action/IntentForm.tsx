import {
  Form,
  FormProps,
  SubmitOptions,
  useActionData,
  useSubmit,
} from "@remix-run/react";
import React, {
  FormEvent,
  MutableRefObject,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { serialize } from "superjson";

import type { DefaultActionResult, ActionIntent, DataRecord } from "./types.js";
import { deepEqual, mergeFormDataWithJson } from "./helpers.js";
import { useMergedRef } from "./use-merged-ref.js";

export type IntentFormRenderProps<CONTEXT = DefaultActionResult> = {
  intent: ActionIntent;
  defaultContext?: CONTEXT;
  context?: CONTEXT;
  ref?: MutableRefObject<HTMLFormElement | undefined>;
  actionData?: CONTEXT;
  children?: ReactNode;
  valid: boolean;
  changed: boolean;
};

export type IntentFormRenderComponent<CONTEXT = DefaultActionResult> = (
  props: IntentFormRenderProps<CONTEXT>,
) => ReactNode;

export type ContextValidationFunction<CONTEXT = DefaultActionResult> = ({
  defaultContext,
  values,
  changed,
}: {
  defaultContext: CONTEXT;
  values: CONTEXT;
  changed: boolean;
}) => boolean;

export type IntentFormProps<
  ROUTE extends ActionIntent,
  CONTEXT = DefaultActionResult,
> = Omit<FormProps, "children"> & {
  children?: ReactNode | IntentFormRenderComponent<CONTEXT>;
  intent: ROUTE;
  defaultContext?: CONTEXT;
  ref?: MutableRefObject<HTMLFormElement | undefined>;
  invalid?: boolean | ContextValidationFunction<CONTEXT>;
  trackChanges?: boolean;
};

export type IntentFormComponent<
  ROUTE extends ActionIntent,
  CONTEXT = DefaultActionResult,
> = (props: IntentFormProps<ROUTE, CONTEXT>) => ReactElement;

export function IntentForm<
  ROUTE extends ActionIntent,
  CONTEXT extends DataRecord,
>({
  children,
  defaultContext = {} as CONTEXT,
  ref,
  intent,
  method = "POST",
  invalid,
  trackChanges,
  ...props
}: IntentFormProps<ROUTE, CONTEXT>) {
  const [context, setContext] = useState<CONTEXT>(defaultContext);
  // check if values have changed from defaultContext
  const changed = !deepEqual(context, defaultContext);
  const meta = serialize(context);
  const actionData = useActionData() as CONTEXT;
  const submit = useSubmit();
  const valid =
    !invalid ||
    (typeof invalid === "function" &&
      !invalid({
        changed,
        defaultContext: defaultContext,
        values: context,
      }));
  const rendered =
    children &&
    (typeof children === "function"
      ? children({
          intent,
          ref,
          changed,
          defaultContext,
          context,
          actionData,
          valid,
        })
      : children);

  const formRef = useRef<HTMLFormElement>();
  const actualRef = useMergedRef(ref, formRef);
  useEffect(() => {
    if (!trackChanges || !formRef.current) {
      setContext(defaultContext || ({} as CONTEXT));
    } else {
      handleChange(formRef.current);
    }
  }, [trackChanges, JSON.stringify(defaultContext)]);
  useEffect(() => {
    const submitButtons = formRef.current?.querySelectorAll(
      'button[type="submit"]',
    );
    const resetButtons = formRef.current?.querySelectorAll(
      'button[type="reset"]',
    );
    submitButtons?.forEach((button) => {
      if (valid) button.removeAttribute("disabled");
      else if (button.getAttribute("value") !== "ignore-disabled")
        button.setAttribute("disabled", "");
    });
    resetButtons?.forEach((button) => {
      if (changed) button.removeAttribute("disabled");
      else if (button.getAttribute("value") !== "ignore-disabled")
        button.setAttribute("disabled", "");
    });
  }, [valid]);

  const handleChange = (e: HTMLFormElement) => {
    if (!trackChanges) return;
    const inputs = e.querySelectorAll("input");
    const inputHash = Array.from(inputs || []).reduce(
      (acc, input) => {
        acc[input.name] =
          input.type === "checkbox"
            ? JSON.stringify(input.checked)
            : input.value;
        return acc;
      },
      {} as Record<string, string | boolean>,
    );
    const entries = Object.entries(inputHash);
    const values = mergeFormDataWithJson(entries.values(), meta) as CONTEXT;
    setContext(values);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (
      !valid &&
      document.activeElement?.getAttribute("value") !== "ignore-disabled"
    )
      return e.preventDefault();

    props.onSubmit?.(e);
    const intentElm = e.currentTarget.querySelectorAll(
      'input[type="hidden"][name="intent"]',
    )[0];
    if (intentElm) {
      const newIntent = document.activeElement?.getAttribute("intent");
      if (newIntent && newIntent !== intent) {
        e.preventDefault();
        intentElm.setAttribute("value", newIntent);
        const method =
          intentElm.getAttribute("formMethod") ||
          e.currentTarget.method ||
          "POST";
        submit(e.currentTarget, {
          method,
        } as SubmitOptions);
      }
    }
  };
  const handleReset = (e: FormEvent<HTMLFormElement>) => {
    props.onReset?.(e);
    setContext(defaultContext || ({} as CONTEXT));
  };

  return (
    <Form
      ref={actualRef}
      method={method}
      {...props}
      onSubmit={handleSubmit}
      onChange={(e) => {
        props.onChange?.(e);
        handleChange(e.currentTarget);
      }}
      onReset={handleReset}
    >
      <input type="hidden" name="__meta" value={JSON.stringify(meta)} />
      <input type="hidden" name="intent" value={intent} />
      {rendered}
    </Form>
  );
}
