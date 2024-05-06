# 🎬 And Action 
## A Feature-Rich API Router for 💿 Remix.run with Typed Forms and ActionData Guards 

This library enhances the developer experience by simplifying the management of complex action API routes in Remix applications.

*Warning:* This library is currently in its early stages and should not be used in production environments.

### Inspiration and Background
While developing this library, the author discovered a similar project named `Conform`. Despite the similarities, the unique features of this library warranted its continuation.
The initial inspiration came from a Remix tutorial by Ryan Florence, highlighting a method to control logic branches using a hidden `_action` input field within action functions. 
The ambiguous use of the term 'action' in this context led to the introduction of a more descriptive variable named `intent`, enhancing clarity.

The library also addresses the handling of HTTP methods beyond GET, such as POST, PUT, and DELETE. It encourages developers to structure their code to prevent complexity before it becomes unmanageable.

Form handling was another area of focus. The library aims to maximize type safety and improve the developer experience by streamlining form-related operations in larger applications.

This approach doesn't replace the existing action handling in Remix but offers a refined method for building and managing complex API actions, promoting code reuse and more structured execution across different parts of an application.

## Intent
Defining the `intent` explicitly improves the alignment between your API and client-side operations, leading to more efficient backend integrations.

Intents are defined as simple string enumerations:
```ts
export type FooIntents = "foo" | "bar" | "foo.bar";
```

This facilitates more organized API definitions and makes use of dot notation for clarity in complex domains.

Based on these intents, API actions are configured using the `ApiResource` type:

```ts
export const fooApiServer: ResourceApi<FooIntents, FooContext, FooResponse> = {
    foo,
    bar: async () => ({ data: { answer: "should be bar" } }),
    "foo.bar": async () => ({ data: { answer: "should be foo.bar" } }),
};
```

## Detailed API Action Definitions

The ```ResourceApi structure allows for simple function definitions for methods other than GET:


Note that `bar` and `foo.bar` are just simple functions, which will serve all the non `GET` methods, 
like `POST`, `PUT`, `DELETE`, etc.

But `foo` is a bit more complex. Here we do a breakdown of the type of method and isolates the logic
for each method:

```ts
export const POST: ApiAction<FooContext, FooDataResponse> = async ({context}) => {
    const response: DataResponse<{answer: string; defaultContext: SuperJSONResult;}> = {
        data: {
            answer: "should be foo",
            defaultContext: serialize(context),
        },
    };
    return response;
};

const DELETE: ApiAction<FooContext, Response> = async () => {
    return redirect("/");
};

export const foo: ApiResource<FooContext, FooResponse> = {
    POST,
    DELETE,
};
```
Note that we are using `superjson` to serialize the context in the `formdata` of a form/request. This might change once
Remix v3 is released.

### The rest of this document is a work in progress.