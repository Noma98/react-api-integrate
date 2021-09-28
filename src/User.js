import React from 'react'
import axios from 'axios';
import { useAsync } from 'react-async';

//프로미스를 반환하는 함수의 파라미터를 객체 형태로 해주어야 함
async function getUser({ id }) {
    const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${id}`
    );
    return response.data;
}

function User({ id }) {
    //렌더링하는 시점이 아닌 사용자의 특정 인터랙션에 따라 API를 호출하고 싶을 땐 promiseFn 대신 deferFn을 사용하고, reload 대신 run 함수를 사용하면 된다.
    const { data: user, error, isLoading } = useAsync({
        promiseFn: getUser,
        id,
        watch: id //watch에 설정한 값이 바뀔 때마다 promiseFn에 넣은 함수 재호출
    })

    if (isLoading) return <div>로딩중</div>;
    if (error) return <div>에러 발생</div>;
    if (!user) return null;

    return (
        <div>
            <h2>{user.username}</h2>
            <p>
                <b>Email:</b> {user.email}
            </p>
        </div>
    )
}

export default User
