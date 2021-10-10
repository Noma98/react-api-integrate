import axios from 'axios'
import React, { useEffect } from 'react'
import useAsync from './useAsync'
import { getUser, useUsersDispatch, useUsersState } from './usersContext';

function User({ id }) {
    const state = useUsersState();
    const dispatch = useUsersDispatch();
    const { data: user, loading, error } = state.user;

    useEffect(() => {
        getUser(dispatch, id);
    }, [id, dispatch]);

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러 발생</div>;
    if (!user) return null;
    return (
        <div>
            <h1>{user.name}</h1>
            <p>Email: {user.email}</p>
        </div>
    )
}

export default User
