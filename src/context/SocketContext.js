import { createContext } from "react";
import { useSocket } from "../hooks/useSocket";

export const SocketContext = createContext()

const baseUrl = process.env.REACT_APP_API_URL

export const SocketProvider = ({children}) => {

    const {socket, online} = useSocket(`${baseUrl}`)

    return (
        <SocketContext.Provider value={{socket, online}}>
            {children}
        </SocketContext.Provider>
    )
}