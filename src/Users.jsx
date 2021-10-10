import React, { useState } from 'react'
import User from './User';
import { useUsersState, useUsersDispatch, getUsers } from './usersContext';

function Users() {
    const state = useUsersState();
    const dispatch = useUsersDispatch();

    const { data: users, error, loading } = state.users;
    const fetchData = () => {
        getUsers(dispatch);
    }
    const [userId, setUserId] = useState(null);

    if (loading) return <div>로딩중</div>
    if (error) return <div>에러 발생</div>
    if (!users) return <button onClick={fetchData}>불러오기</button>;
    return (
        <>
            <ul>
                {users.map(user =>
                    <li key={user.id} onClick={() => setUserId(user.id)}>
                        {user.username}({user.name})
                    </li>
                )}
                {userId && <User id={userId} />}
            </ul>
            <button onClick={fetchData}>다시 불러오기</button>
        </>
    )
}

export default Users
