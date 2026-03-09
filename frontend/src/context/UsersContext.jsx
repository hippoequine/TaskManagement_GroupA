import { createContext } from 'react';
import { usersApi } from '../api/usersApi';
import { useEffect, useCallback, useState } from 'react';
import { useContext } from 'react';

const UsersContext = createContext(null);

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await usersApi.getAll();
      setUsers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <UsersContext.Provider value={{ users, loading, error, fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => useContext(UsersContext);
