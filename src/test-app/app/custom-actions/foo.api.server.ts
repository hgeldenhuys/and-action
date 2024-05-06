import { ResourceApi } from "../../../and-action/api/types";
import { FooContext, FooResponse, FooIntents } from "~/custom-actions/types";
import { foo } from "~/custom-actions/foo.methods";
import { createApiRoutes } from "../../../and-action/api/api.server";

export const fooApiServer: ResourceApi<FooIntents, FooContext, FooResponse> = {
  foo,
  bar: async () => ({ data: { answer: "should be bar" } }),
  "foo.bar": async () => ({ data: { answer: "should be foo.bar" } }),
};

export const actions = createApiRoutes<FooIntents, FooContext, FooResponse>(
  fooApiServer
);
