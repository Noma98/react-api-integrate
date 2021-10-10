import React, { useEffect, useReducer } from 'react'
import axios from 'axios';

const initialState = {
    loading: false,
    data: null,
    error: null
};

function reducer(state, action) {
    switch (action.type) {
        case 'LOADING':
            return {
                loading: true,
                data: null,
                error: null
            }
        case 'SUCCESS':
            return {
                loading: false,
                data: action.data,
                error: null
            }
        case 'ERROR':
            return {
                loading: false,
                data: null,
                error: action.error
            }
        default:
            throw new Error('알 수 없는 액션 타입');
    }
};

function Users() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { data: users, loading, error } = state;
    const fetchUsers = async () => {
        dispatch({ type: 'LOADING' });
        try {
            const response = await axios.get(
                'https://jsonplaceholder.typicode.com/users'
            );
            dispatch({ type: 'SUCCESS', data: response.data });
        } catch (error) {
            dispatch({ type: 'ERROR', error })
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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
