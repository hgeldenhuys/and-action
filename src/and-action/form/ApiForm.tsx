import {
  Form,
  SubmitOptions,
  useActionData,
  useFetcher,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { serialize } from "superjson";

import { ApiIntent, DataRecord } from "../api/types";
import { deepEqual, mergeFormDataWithJson } from "../helpers";
import { useMergedRef } from "../use-merged-ref";
import { ApiFormProps } from "./types";
import { IntentFormProvider } from "./use-intent-form";

export function ApiForm<
  ROUTE extends ApiIntent,
  CONTEXT extends DataRecord,
  RESULT,
>({
  children,
  defaultContext = {} as CONTEXT,
  ref,
  intent,
  method = "POST",
  invalid,
  withTracking,
  withFetcher,
  withoutIntent,
  withProvider,
  ...props
}: ApiFormProps<ROUTE, CONTEXT, RESULT>) {
  const [context, setContext] = useState<CONTEXT>(defaultContext);
  const formRef = useRef<HTMLFormElement>();
  const actualRef = useMergedRef(ref, formRef);
  const actionData = useActionData() as RESULT;
  const submit = useSubmit();
  const clickedRef = useRef<HTMLButtonElement>();
  const fetcher = useFetcher();
  const { state, location } = useNavigation();

  const changed = !deepEqual(context, defaultContext);
  const meta = serialize(context);
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
  const ctxThumbprint = JSON.stringify(context);
  const handleTracking = () => {
    if (!withTracking || !formRef.current) {
      setContext(defaultContext || ({} as CONTEXT));
    } else {
      handleChange(formRef.current);
    }
  };
  const handleButtonStates = () => {
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
  };
  const handleChange = (e: HTMLFormElement) => {
    if (!withTracking) return;
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
      clickedRef.current?.getAttribute("value") !== "ignore-disabled"
    )
      return e.preventDefault();

    props.onSubmit?.(e);

    if (clickedRef.current) {
      const newIntent = clickedRef.current?.getAttribute("intent");
      const intentInput = e.currentTarget.querySelector(
        'input[name="intent"]',
      ) as HTMLInputElement;

      if (newIntent && intentInput && newIntent !== intent) {
        e.preventDefault();
        intentInput.setAttribute("value", newIntent);
        const method =
          clickedRef.current.getAttribute("formMethod") ||
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
  const handleInitialization = () => {
    if (!formRef.current) return;
    const buttons = formRef.current?.querySelectorAll("button");
    const onClick = (e: MouseEvent) => {
      clickedRef.current = e.target as HTMLButtonElement;
    };
    buttons?.forEach((button) => {
      button.addEventListener("click", onClick);
    });
    return () => {
      buttons?.forEach((button) => {
        button.removeEventListener("click", onClick);
      });
    };
  };

  const handleTransition = () => {
    const inputs = formRef.current?.querySelectorAll("input");
    if (inputs)
      for (const input of inputs) {
        if (state !== "idle") {
          input.setAttribute(
            "disabled-old",
            JSON.stringify(!!input.getAttribute("disabled")),
          );
          input.setAttribute("disabled", "");
        } else {
          const disabled = input.getAttribute("disabled-old");
          input.removeAttribute("disabled-old");
          if (disabled && JSON.parse(disabled)) {
            input.setAttribute("disabled", disabled);
          } else {
            input.removeAttribute("disabled");
          }
        }
      }
  };

  useEffect(handleTracking, [withTracking, withFetcher, ctxThumbprint]);
  useEffect(handleButtonStates, [valid, withFetcher, withTracking]);
  useEffect(handleInitialization, [formRef.current, withFetcher]);
  useEffect(handleTransition, [state, location?.pathname]);
  console.log({ state });

  const form = withFetcher ? (
    <fetcher.Form
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
    </fetcher.Form>
  ) : (
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
      {!withoutIntent && <input type="hidden" name="intent" value={intent} />}
      {rendered}
    </Form>
  );
  if (withProvider)
    return <IntentFormProvider context={context}>{form}</IntentFormProvider>;
  return form;
}
