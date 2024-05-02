import { FooContext, FooIntents } from "~/custom-actions/types";
import { createForm } from "../../../and_action/create-form";

export const FooIntentForm = createForm<FooIntents, FooContext>();
