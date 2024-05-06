import { DataResponse } from "../../../and-action/api/types";
import { SuperJSONResult } from "superjson";

export type FooIntents = "foo" | "bar" | "foo.bar";

export type FooContext = {
  Number: number;
  Date: Date;
  Null: null;
  Undefined: undefined;
  Boolean: boolean;
  Array: [1, 2, 3];
  Object: {
    foo: {
      bar: string;
    };
  };
  String: string;
};

export type FooDataResponse = DataResponse<{
  answer: string;
  defaultContext?: SuperJSONResult;
}>;

export type FooResponse = Response | FooDataResponse;

export const fooDefaults: FooContext = {
  Number: 1,
  Date: new Date("2021-01-01T00:00:00Z"),
  Null: null,
  Undefined: undefined,
  Boolean: true,
  Array: [1, 2, 3],
  Object: {
    foo: {
      bar: "baz",
    },
  },
  String: "foo",
};
