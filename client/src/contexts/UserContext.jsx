import { createContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [isFullRoom, setIsFullRoom] = useState(false);
    const [userName, setUserName] = useState("")
    const [myId, setMyId] = useState(null)

    return (
        <UserContext.Provider
            value={{ userName, setUserName, myId, setMyId, isLogged, setIsLogged, isFullRoom, setIsFullRoom }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
