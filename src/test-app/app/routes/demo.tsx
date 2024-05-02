import type { MetaFunction } from "@remix-run/node";
import { deserialize, serialize } from "superjson";
import { useState } from "react";
import { FooIntentForm } from "~/custom-actions/form";
import {
  FooContext,
  FooDataResponse,
  fooDefaults,
} from "~/custom-actions/types";
import { actions } from "~/custom-actions/foo.api.server";

import { useAjvGuard } from "../../../and-action/use-ajv-guard";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = actions.use();

export default function Index() {
  const { data, valid } = useAjvGuard<FooDataResponse>({
    sampleData: {
      data: { answer: "", defaultContext: serialize(fooDefaults) },
    },
  });
  const { valid: valid2 } = useAjvGuard<FooDataResponse>({
    sampleData: {
      data: { answer: "" },
    },
  });
  // const { data, valid } = useZodGuard<FooDataResponse>({
  //   sampleData: {
  //     data: { answer: "", defaultContext: serialize(fooDefaults) },
  //   },
  // });
  // const actionData = useActionData() as FooDataResponse;
  // const data = actionData?.data?.defaultContext as SuperJSONResult | undefined;
  const values: FooContext = {
    ...(data?.data?.defaultContext
      ? deserialize(data.data.defaultContext)
      : fooDefaults),
  };

  const [trackChanges, setTrackChanges] = useState(true);
  // const [date, setDate] = useState<Date | undefined>(values.date as Date);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.8",
      }}
    >
      <h1>Action Router Demo</h1>
      <input
        id="updateContext"
        type="checkbox"
        checked={trackChanges}
        onChange={() => setTrackChanges(!trackChanges)}
      />
      <label htmlFor="invalid">Track Changes</label>
      <span style={{ paddingLeft: "1rem", opacity: 0.5, fontSize: 11 }}>
        this basically updates the state from the form values if you do not want
        to manage updating state
      </span>

      <FooIntentForm
        invalid={({ changed }) => {
          console.log({ changed });
          return !changed && trackChanges;
        }}
        method="POST"
        intent="foo"
        defaultContext={{ ...values, ...{ override: true } }}
        trackChanges={trackChanges}
      >
        {({ intent, context, changed, defaultContext, actionData }) => {
          return (
            <div
              style={{
                border: "1px solid black",
                padding: "1rem",
                margin: "1rem",
                overflow: "hidden",
              }}
            >
              <h1>
                Intent: {intent} {changed ? "*" : ""}
              </h1>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div style={{ width: 400 }}>
                  <div style={{ display: "flex" }}>
                    <label htmlFor="aBoolean">aBoolean</label>
                    <input
                      id="aBoolean"
                      type="checkbox"
                      name="aBoolean"
                      defaultChecked={values?.aBoolean}
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <label htmlFor="aNumber">aNumber</label>
                    <input
                      id="aNumber"
                      type="number"
                      name="aNumber"
                      defaultValue={`${values?.aNumber}` || "0"}
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <label htmlFor="aString">aString</label>
                    <input
                      id="aString"
                      type="text"
                      name="aString"
                      defaultValue={`${values?.aString}` || ""}
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <label htmlFor="anArray">anArray</label>
                    <input
                      id="anArray"
                      type="text"
                      name="anArray"
                      defaultValue={`${values?.anArray}` || "[]"}
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <label htmlFor="anObject">anObject</label>
                    <input
                      id="anObject"
                      type="text"
                      name="anObject"
                      defaultValue={
                        values?.anObject
                          ? JSON.stringify(values?.anObject)
                          : "{}"
                      }
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <label htmlFor="aDate">aDate</label>
                    <input
                      id="aDate"
                      type="date"
                      name="aDate"
                      defaultValue={
                        values?.aDate
                          ? (values?.aDate as Date).toISOString().split("T")[0]
                          : ""
                      }
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "stretch",
                      paddingTop: "1rem",
                    }}
                  >
                    <button style={{ flexGrow: 1 }} type="submit">
                      POST
                    </button>
                    <button
                      style={{ flexGrow: 1 }}
                      type="submit"
                      formMethod="DELETE"
                      value="ignore-disabled"
                    >
                      DELETE
                    </button>
                    <button style={{ flexGrow: 1 }} type="reset">
                      Reset
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "stretch",
                      paddingTop: "1rem",
                    }}
                  >
                    <button
                      style={{ flexGrow: 1 }}
                      type="submit"
                      value="ignore-disabled"
                      {...{ intent: "foo.bar" }}
                    >
                      POST Foo.Bar
                    </button>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      paddingTop: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        border: "1px solid black",
                        padding: 10,
                        color:
                          valid === undefined
                            ? "black"
                            : valid
                            ? "green"
                            : "red",
                      }}
                    >
                      <pre>
                        <b>Foo Data: </b>
                        {JSON.stringify(valid) === undefined
                          ? "Unavailable"
                          : JSON.stringify(valid) === "true"
                          ? "Valid"
                          : "Invalid"}
                      </pre>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        border: "1px solid black",
                        padding: 10,
                        color:
                          valid2 === undefined
                            ? "black"
                            : valid2
                            ? "green"
                            : "red",
                      }}
                    >
                      <pre>
                        <b>Foo.Bar Data: </b>
                        {JSON.stringify(valid2) === undefined
                          ? "Unavailable"
                          : JSON.stringify(valid2) === "true"
                          ? "Valid"
                          : "Invalid"}
                      </pre>
                    </div>
                  </div>
                  <pre>ActionData: {JSON.stringify(actionData, null, 2)}</pre>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div style={{ fontSize: 11 }}>
                    <div>
                      <label htmlFor="bool">Default</label>
                      <pre>{JSON.stringify(defaultContext, null, 2)}</pre>
                    </div>
                  </div>
                  <div style={{ fontSize: 11 }}>
                    <div>
                      <label htmlFor="bool">Context</label>
                      <pre>{JSON.stringify(context, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </div>
              {/*<DatePickerInput*/}
              {/*    name="date"*/}
              {/*    label="Pick date"*/}
              {/*    placeholder="Pick date"*/}
              {/*    defaultValue={values?.date as Date}*/}
              {/*/>*/}
            </div>
          );
        }}
      </FooIntentForm>
    </div>
  );
}
