export const initialAsyncState = {
    loading: false,
    data: null,
    error: null
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

export function createAsyncHandler(type, key) {
    const SUCCESS = `${type}_SUCCESS`;
    const ERROR = `${type}_SUCCESS`;

    function handler(state, action) {
        switch (action.type) {
            case type:
                return {
                    ...state,
                    [key]: loadingState
                };
            case SUCCESS:
                return {
                    ...state,
                    [key]: success(action.data)
                };
            case ERROR:
                return {
                    ...state,
                    [key]: error(action.error)
                }
            default:
                return state;
        }
    }
    return handler;
}
export function createAsyncDispatcher(type, promiseFn) {
    const SUCCESS = `${type}_SUCCESS`;
    const ERROR = `${type}_ERROR`;

    async function actionHandler(dispatch, ...rest) {
        dispatch({ type });
        try {
            const data = await promiseFn(...rest);
            dispatch({ type: SUCCESS, data });
        } catch (error) {
            dispatch({ type: ERROR, error })
        }
    }
    return actionHandler;
}