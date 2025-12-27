// QuotaContext.tsx
import { createContext, useContext, useState } from "react";

const QuotaContext = createContext<{
  quotaExceeded: boolean;
  setQuotaExceeded: (val: boolean) => void;
}>({
  quotaExceeded: false,
  setQuotaExceeded: () => {},
});

export const QuotaProvider = ({ children }: { children: React.ReactNode }) => {
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  return (
    <QuotaContext.Provider value={{ quotaExceeded, setQuotaExceeded }}>
      {children}
    </QuotaContext.Provider>
  );
};

export const useQuota = () => useContext(QuotaContext);
