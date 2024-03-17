import { useContext } from 'react';
import AuthContext from '../context/authContextProvider';

export default function useAuth() {
    return useContext(AuthContext);
}