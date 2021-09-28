// 이 함수는 파라미터로 액션의 타입과 Promise를 만들어 주는 함수를 받아온다.
export function createAsyncDispatcher(type, promiseFn) {
    //성공, 실패에 대한 액션 타입 문자열 만들기
    const SUCCESS = `${type}_SUCCESS`;
    const ERROR = `${type}_ERROR`;

    async function actionHandler(dispatch, ...rest) {
        dispatch({ type });
        try {
            const data = await promiseFn(...rest);
            dispatch({
                type: SUCCESS,
                data
            });
        } catch (err) {
            dispatch({
                type: ERROR,
                error: err
            })
        }
    }
    return actionHandler; //만든 함수 반환
}

export const initialAsyncState = {
    loading: false,
    data: null,
    error: null
};
// 로딩 중일 때 바뀔 상태 객체
const loadingState = {
    loading: true,
    data: null,
    error: null
}

// 성공했을 때의 상태를 만들어주는 함수
const success = data => ({
    loading: false,
    data,
    error: null
});

const error = error => ({
    loading: false,
    data: null,
    error: error
});

// 세 가지 액션을 처리하는 리듀서를 만들자.
// type은 액션 타입, key는 리듀서에서 사용할 필드 이름 (예:users, user)
export function createAsyncHandler(type, key) {
    //성공, 실패에 대한 액션 타입 문자열 준비
    const SUCCESS = `${type}_SUCCESS`;
    const ERROR = `${type}_ERROR`;

    //함수 새로 만들어서
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
                };
            default:
                return state;
        }
    }
    //반환하기
    return handler;
}