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

import { useAjvGuard } from "../../../and-action/guards/use-ajv-guard";
import { Button2 } from "~/components/button2";
import { Field, FieldGroup, Fieldset } from "~/components/fieldset";
import { Input } from "~/components/input";
import { Table } from "~/components/table";

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
  console.log({ data, valid });
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
  const [withFetcher, setWithFetcher] = useState(false);

  const buttonClass = (color: string) =>
    `flex-1 rounded-lg disabled:bg-gray-700 disabled:text-violet-100 text-${color}-500 border-${color}-800 border-2 disabled:cursor-not-allowed px-4 py-2 text-center font-semibold text-sm hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-600`;

  return (
    <div id="container" className="gap-3 flex flex-col">
      <div className="hidden border-red-800 bg-blue-800" />
      <div className="hidden border-violet-800" />
      <div className="hidden border-red-800 text-red-100" />
      <div className="hidden border-gray-800 text-red-500" />
      <div className="hidden border-red-800 text-violet-100" />
      <div className="hidden border-gray-800 text-violet-500" />
      <div className="hidden border-amber-800 text-amber-500" />
      <div className="hidden border-red-800 text-amber-100" />
      <h1 className="bg-gradient-to-br from-violet-800 to-blue-800 text-transparent bg-clip-text font-bold text-4xl">
        Action Router Demo
      </h1>
      <Field className="gap-2 flex items-center">
        <input
          id="updateContext"
          type="checkbox"
          checked={trackChanges}
          onChange={() => setTrackChanges(!trackChanges)}
        />
        <label htmlFor="invalid">Track Changes</label>
        <span style={{ paddingLeft: "1rem", opacity: 0.5, fontSize: 11 }}>
          this updates the state from the form elements if you do not want to
          manage updating state manually
        </span>
      </Field>
      <Field className="gap-2 flex items-center">
        <input
          id="withFetcher"
          type="checkbox"
          checked={withFetcher}
          onChange={() => setWithFetcher(!withFetcher)}
        />
        <label htmlFor="withFetcher">With Fetcher</label>
      </Field>

      <FooIntentForm
        invalid={({ changed }) => {
          console.log({ changed });
          return !changed && trackChanges;
        }}
        method="POST"
        intent="foo"
        defaultContext={{ ...values, ...{ override: true } }}
        withTracking={trackChanges}
        withFetcher={withFetcher}
      >
        {({ intent, context, changed, defaultContext, actionData }) => {
          return (
            <div className="bg-gray-800 border-4 rounded-lg p-4 overflow-hidden border-violet-400 flex-col">
              <h1 className="text-2xl m-2">
                Current intent: {intent} {changed ? "*" : ""}
              </h1>
              <div className="grid grid-cols-2 gap-2">
                <Fieldset className="rounded-lg border border-violet-500 p-3">
                  <FieldGroup className="w-full">
                    <div className="flex flex-row">
                      <label htmlFor="Boolean" className="flex-1">
                        Boolean
                      </label>
                      <input
                        type="checkbox"
                        id="Boolean"
                        name="Boolean"
                        defaultChecked={values?.Boolean}
                        className="w-4 h-4"
                      />
                    </div>
                    <Field>
                      <label htmlFor="Number">Number</label>
                      <Input
                        id="Number"
                        type="number"
                        name="Number"
                        defaultValue={`${values?.Number}` || "0"}
                        style={{ marginLeft: "auto" }}
                      />
                    </Field>
                    <Field>
                      <label htmlFor="String">String</label>
                      <Input
                        id="String"
                        type="text"
                        name="String"
                        defaultValue={`${values?.String}` || ""}
                        style={{ marginLeft: "auto" }}
                      />
                    </Field>
                    <Field>
                      <label htmlFor="Object">Object</label>
                      <Input
                        id="Object"
                        type="text"
                        name="Object"
                        defaultValue={
                          values?.Object ? JSON.stringify(values?.Object) : "{}"
                        }
                        style={{ marginLeft: "auto" }}
                      />
                    </Field>
                    <Field>
                      <label htmlFor="Object">Array</label>
                      <Input
                        id="Array"
                        type="text"
                        name="Array"
                        defaultValue={
                          values?.Array ? values?.Array.join(",") : ""
                        }
                        style={{ marginLeft: "auto" }}
                      />
                    </Field>
                    <Field>
                      <label htmlFor="Date">Date</label>
                      <Input
                        id="Date"
                        type="date"
                        name="Date"
                        defaultValue={
                          values?.Date
                            ? (values?.Date as Date).toISOString().split("T")[0]
                            : ""
                        }
                        style={{ marginLeft: "auto" }}
                      />
                    </Field>
                  </FieldGroup>
                  <Field
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "stretch",
                      paddingTop: "1rem",
                    }}
                  >
                    <button className={buttonClass("violet")} type="submit">
                      POST
                    </button>
                    <button
                      className={buttonClass("amber")}
                      type="submit"
                      formMethod="DELETE"
                      value="ignore-disabled"
                    >
                      DELETE
                    </button>
                    <button className={buttonClass("blue")} type="reset">
                      Reset
                    </button>
                  </Field>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "stretch",
                      paddingTop: "1rem",
                    }}
                  >
                    <button
                      className={buttonClass("violet")}
                      type="submit"
                      value="ignore-disabled"
                      {...{ intent: "foo.bar" }}
                      onClick={() => {
                        console.log("CLICKED");
                      }}
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
                      className={`bg-gray-700 rounded-lg p-4 text-xs ${
                        valid === undefined
                          ? ""
                          : valid
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
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
                      className={`bg-gray-700 rounded-lg p-4 text-xs ${
                        valid2 === undefined
                          ? ""
                          : valid2
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
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
                </Fieldset>
                <div>
                  <Table className="border-violet-400 border-2 rounded-lg">
                    <thead>
                      <tr>
                        <th className="p-2 bg-gray-900 font-bold">Key</th>
                        <th className="p-2 bg-gray-900 font-bold">Default</th>
                        <th className="p-2 bg-gray-900 font-bold">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys({ ...context, ...defaultContext }).map(
                        (key) => {
                          const value = { ...context }[key];
                          const defaultValue = { ...defaultContext }[key];
                          return (
                            <tr
                              key={key}
                              className={
                                JSON.stringify(value) ===
                                JSON.stringify(defaultValue)
                                  ? ""
                                  : "bg-slate-500"
                              }
                            >
                              <td className="p-2 bg-gray-900">{key}</td>
                              <td className="p-2">
                                {JSON.stringify(defaultValue)}
                              </td>
                              <td className="p-2">{JSON.stringify(value)}</td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </Table>
                  <div className="p-5 text-sm">
                    <h2 className="text-lg">ActionData</h2>
                    <pre className="overflow-auto h-[300px]">
                      {JSON.stringify(actionData?.data, null, 2)}
                    </pre>
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
