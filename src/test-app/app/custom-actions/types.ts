import { DataResponse } from "../../../and_action/types";
import { SuperJSONResult } from "superjson";

export type FooIntents = "foo" | "bar" | "foo.bar";

export type FooContext = {
  aNumber: number;
  aDate: Date;
  aNull: null;
  anUndefined: undefined;
  aBoolean: boolean;
  anArray: [1, 2, 3];
  anObject: {
    foo: {
      bar: string;
    };
  };
  aString: string;
};

export type FooDataResponse = DataResponse<{
  answer: string;
  defaultContext?: SuperJSONResult;
}>;

export type FooResponse = Response | FooDataResponse;

export const fooDefaults: FooContext = {
  aNumber: 1,
  aDate: new Date("2021-01-01T00:00:00Z"),
  aNull: null,
  anUndefined: undefined,
  aBoolean: true,
  anArray: [1, 2, 3],
  anObject: {
    foo: {
      bar: "baz",
    },
  },
  aString: "foo",
};
