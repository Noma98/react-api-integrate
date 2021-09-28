import React, { useEffect, useCallback, useReducer } from 'react'
import axios from 'axios';

function reducer(state, action) {
    switch (action.type) {
        case 'LOADING':
            return {
                loading: true,
                data: null,
                error: null
            };
        case 'ERROR':
            return {
                loading: false,
                data: null,
                error: action.err,
            };
        case 'SUCCESS':
            return {
                loading: false,
                data: action.users,
                error: null
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}
const initialState = {
    loading: false,
    data: null,
    error: null,
}
function Users() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { data: users, loading, error } = state;

    const fetchUsers = useCallback(async () => {
        dispatch({ type: 'LOADING' });
        try {
            const response = await axios.get(
                'https://jsonplaceholder.typicode.com/users'
            );
            dispatch({ type: 'SUCCESS', users: response.data });
        } catch (err) {
            dispatch({ type: 'ERROR', error: err });
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (loading) return <div>로딩중</div>
    if (error) return <div>에러 발생</div>
    if (!users) return null;
    return (
        <ul>
            {users.map(user =>
                <li key={user.id}>
                    {user.username}({user.name})
                </li>
            )}
            <button onClick={fetchUsers}>다시 불러오기</button>
        </ul>
    )
}

export default Users
