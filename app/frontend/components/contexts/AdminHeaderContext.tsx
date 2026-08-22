import { createContext, useContext, useState, ReactNode } from "react";

interface AdminHeaderContextType {
  headerContent: ReactNode | null;
  setHeaderContent: (content: ReactNode | null) => void;
}

const AdminHeaderContext = createContext<AdminHeaderContextType>({
  headerContent: null,
  setHeaderContent: () => {},
});

export function AdminHeaderProvider({ children }: { children: ReactNode }) {
  const [headerContent, setHeaderContent] = useState<ReactNode | null>(null);
  return (
    <AdminHeaderContext.Provider value={{ headerContent, setHeaderContent }}>
      {children}
    </AdminHeaderContext.Provider>
  );
}

export function useAdminHeader() {
  return useContext(AdminHeaderContext);
}