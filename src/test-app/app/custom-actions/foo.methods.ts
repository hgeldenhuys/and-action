import {
  ApiAction,
  ApiResource,
  DataResponse,
} from "../../../and-action/types";
import { serialize, SuperJSONResult } from "superjson";
import {
  FooContext,
  FooDataResponse,
  FooResponse,
} from "~/custom-actions/types";
import { redirect } from "@remix-run/router";

export const POST: ApiAction<FooContext, FooDataResponse> = async ({
  context,
}) => {
  const response: DataResponse<{
    answer: string;
    defaultContext: SuperJSONResult;
  }> = {
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
