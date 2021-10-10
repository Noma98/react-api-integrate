import React, { createContext, useContext, useReducer } from 'react'
import { createAsyncHandler, createAsyncDispatcher, initialAsyncState } from './asyncActionUtils';
import * as api from './api';

//usersContext에서 사용할 기본 상태
const initialState = {
    users: initialAsyncState,
    user: initialAsyncState
}

const usersHandler = createAsyncHandler('GET_USERS', 'users');
const userHandler = createAsyncHandler('GET_USER', 'user');

// 위에서 만든 객체와 유틸 함수를 사용해 리듀서 작성
function usersReducer(state, action) {
    switch (action.type) {
        case 'GET_USERS':
        case 'GET_USERS_SUCCESS':
        case 'GET_USERS_ERROR':
            return usersHandler(state, action);
        case 'GET_USER':
        case 'GET_USER_SUCCESS':
        case 'GET_USER_ERROR':
            return userHandler(state, action);
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
export const getUsers = createAsyncDispatcher('GET_USERS', api.getUsers);
export const getUser = createAsyncDispatcher('GET_USER', api.getUser);

export default UsersProvider
