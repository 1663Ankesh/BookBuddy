import { createContext, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [curruser, setCurruser] = useState();
  const [curruseremail, setCurruseremail] = useState();
  const [isuser, setIsuser] = useState();
  const [id, setId] = useState();

  return (
    <UserContext.Provider
      value={{
        curruser,
        setCurruser,
        curruseremail,
        setCurruseremail,
        isuser,
        setIsuser,
        id,
        setId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
