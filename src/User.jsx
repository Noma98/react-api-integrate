import axios from 'axios'
import React from 'react'
import useAsync from './useAsync'

async function getUser(id) {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    return response.data;
}
function User({ id }) {
    const [state] = useAsync(() => getUser(id), [id]);
    const { loading, error, data: user } = state;
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
