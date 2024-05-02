import { ResourceApi } from "../../../and-action/types";
import { FooContext, FooResponse, FooIntents } from "~/custom-actions/types";
import { foo } from "~/custom-actions/foo.methods";
import { createActionRoutes } from "../../../and-action/server";

export const fooApiServer: ResourceApi<FooIntents, FooContext, FooResponse> = {
  foo,
  bar: async () => ({ data: { answer: "should be bar" } }),
  "foo.bar": async () => ({ data: { answer: "should be foo.bar" } }),
};

export const actions = createActionRoutes<FooIntents, FooContext, FooResponse>(
  fooApiServer
);
