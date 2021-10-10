import axios from 'axios'
import React, { createContext, useContext, useReducer } from 'react'

//usersContext에서 사용할 기본 상태
const initialState = {
    users: {
        loading: false,
        data: null,
        error: null
    },
    user: {
        loading: false,
        data: null,
        error: null
    }
}
// 로딩 중일때 바뀔 상태 객체
const loadingState = {
    loading: true,
    data: null,
    error: null
}
// 성공했을 때의 상태를 만들어 주는 함수
const success = data => ({
    loading: false,
    data,
    error: null
})
//실패했을 때의 상태를 만들어 주는 함수
const error = error => ({
    loading: false,
    data: null,
    error
})
// 위에서 만든 객체와 유틸 함수를 사용해 리듀서 작성
function usersReducer(state, action) {
    switch (action.type) {
        case 'GET_USERS':
            return {
                ...state,
                users: loadingState
            };
        case 'GET_USERS_SUCCESS':
            return {
                ...state,
                users: success(action.data)
            };
        case 'GET_USERS_ERROR':
            return {
                ...state,
                users: error(action.error)
            }
        case 'GET_USER':
            return {
                ...state,
                user: loadingState
            };
        case 'GET_USER_SUCCESS':
            return {
                ...state,
                user: success(action.data)
            };
        case 'GET_USER_ERROR':
            return {
                ...state,
                user: success(action.error)
            };
        default:
            throw new Error('알 수 없는 액션 타입');
    }
}
// state용, dispatch용 context 따로 만들기
const UsersStateContext = createContext(null);
const UsersDispatchContext = createContext(null);

// 위에서 선언한 두가지 Context들의 Provider로 감싸주는 컴포넌트
export function UsersProvider({ children }) {
    const [state, dispatch] = useReducer(usersReducer, initialState);
    return (
        <UsersStateContext.Provider value={state}>
            <UsersDispatchContext.Provider value={dispatch}>
                {children}
            </UsersDispatchContext.Provider>
        </UsersStateContext.Provider>
    )
}
//state 쉽게 조회하도록 하는 커스텀 훅
export function useUsersState() {
    const state = useContext(UsersStateContext);
    if (!state) {
        throw new Error('Cannot find UsersProvider');
        //상태가 없는 건 UsersProvider로 감싸지지 않은 하위 컴포넌트에서 접근하려고 해서..
    }
    return state;
}
//dispatch 쉽게 사용하도록 하는 커스텀 훅
export function useUsersDispatch() {
    const dispatch = useContext(UsersDispatchContext);
    if (!dispatch) {
        throw new Error('Cannot find USersProvider');
    }
    return dispatch;
}
export async function getUsers(dispatch) {
    dispatch({ type: 'GET_USERS' });
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        dispatch({ type: 'GET_USERS_SUCCESS', data: response.data });
    } catch (error) {
        dispatch({ type: 'GET_USERS_ERROR', error })
    }
}
export async function getUser(dispatch, id) {
    dispatch({ type: 'GET_USER' });
    try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        dispatch({ type: 'GET_USER_SUCCESS', data: response.data });
    } catch (error) {
        dispatch({ type: 'GET_USER_ERROR', error });
    }
}

export default UsersProvider
