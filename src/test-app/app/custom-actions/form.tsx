import { FooContext, FooIntents } from "~/custom-actions/types";
import { createForm } from "../../../and-action/form/create-form";

export const FooIntentForm = createForm<FooIntents, FooContext>();
