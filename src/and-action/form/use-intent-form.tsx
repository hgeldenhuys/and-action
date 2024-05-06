import React, { ReactNode, useContext } from "react";

export const IntentFormContext = React.createContext<{
  context: any;
}>({ context: "No provider. Use withProvider option" });

export function IntentFormProvider<T>({
  children,
  context,
}: {
  children: ReactNode;
  context: T;
}) {
  return (
    <IntentFormContext.Provider value={{ context }}>
      {children}
    </IntentFormContext.Provider>
  );
}

export function useIntentFormContext<T>() {
  const context = useContext(IntentFormContext).context as T;
  if (context === "No provider. Use withProvider option")
    throw new Error("No provider. Use withProvider option");
  return context;
}
