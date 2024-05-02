# And Action 🎬
## Advanced API router for Remix.run, with advanced Intent Form Component and ActionData Guards 💿

### Use case
When you want to share actions between routes 

## Installation

```shell
npm install and-action
```

## Usage

### Router & Component

```tsx
type MyIntentions = "foo" | "bar" | "foo.bar";

const actionsServer: ActionMap<MyIntentions, DataRecord, TypedResponse<object>> = {
  foo: {
    POST: async (args, defaultContext, actionData) => {
      const method = args.request.method;
      console.log("foo", defaultContext, method);
      console.log("actionData", actionData);
      return json({
        data: {
          answer: "should be foo",
          defaultContext: superjson.serialize(defaultContext),
        },
      });
    },
  },
  bar: async () => json({ data: { answer: "should be bar" } }),
  "foo.bar": async () => json({ data: { answer: "should be foo.bar" } }),
};

export const [actions, MyIntentionsForm] = createActionRoutes<
  MyIntentions,
  DataRecord
>(actionsServer);
```
Now simply use them in a route:

```tsx

   return <MyIntentionsForm
        invalid={({ changed }) => {
          return !changed && trackChanges;
        }}
        method="POST"
        intent="foo"
        defaultContext={values}
        trackChanges={trackChanges}
      >
        {({ intent, values, changed, defaultContext, actionData }) => {
          console.log("values?.date as Date", values?.date as Date);
          return (
            <>
              <pre>{JSON.stringify(changed)}</pre>
              <h1>Intent: {intent}</h1>
              <input type="number" name="xyz" onChange={setXyz} value={xyz} />
              <input
                type="number"
                name="abc"
                defaultValue={`${values?.abc}` || "0"}
              />
              <input
                type="checkbox"
                name="bool"
                defaultChecked={values?.bool as boolean}
              />
              <input
                type="date"
                name="date"
                defaultValue={
                  new Date(
                    (values?.date as Date).getTime() -
                      (values?.date as Date).getTimezoneOffset() * 60000,
                  )
                    .toISOString()
                    .split("T")[0]
                }
              />
              <input
                type="text"
                name="str"
                defaultValue={`${values?.str}` || ""}
              />
              <button type="submit">Submit</button>
              <button type="submit" {...{ intent: "foo.bar" }}>
                Foo.Bar
              </button>
              <button type="reset">Reset</button>
              <div>
                <label htmlFor="bool">Values</label>
                <pre>{JSON.stringify({ ...values, xyz }, null, 2)}</pre>
              </div>
              <div>
                <label htmlFor="bool">defaultContext</label>
                <pre>{JSON.stringify({ ...defaultContext, xyz }, null, 2)}</pre>
              </div>
              <div>
                <label htmlFor="actionData">ActionData:</label>
                <pre>{JSON.stringify(actionData, null, 2)}</pre>
              </div>
            </>
          );
        }}
      </MyIntentionsForm>;
```


### # WIP