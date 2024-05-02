import { FooContext, FooIntents } from "~/custom-actions/types";
import { createForm } from "../../../and-action/create-form";

export const FooIntentForm = createForm<FooIntents, FooContext>();
