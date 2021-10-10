
import { useReducer, useEffect } from 'react';

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


function useAsync(callback, deps = [], skip = false) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const fetchData = async () => {
        dispatch({ type: 'LOADING' });
        try {
            const data = await callback();
            dispatch({ type: 'SUCCESS', data });
        } catch (error) {
            dispatch({ type: 'ERROR', error });
        }
    }
    useEffect(() => {
        if (skip) return;
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return [state, fetchData];
}

export default useAsync
