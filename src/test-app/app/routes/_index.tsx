import type { MetaFunction } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { SuperJSONResult } from "superjson";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const actionData = useActionData() as
    | {
        data: { defaultContext: SuperJSONResult };
      }
    | undefined;
  const data = actionData?.data?.defaultContext as SuperJSONResult | undefined;
  console.log({ data });
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <Link to={"./demo"}>Demo</Link>
    </div>
  );
}
