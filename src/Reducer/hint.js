
export default function hintReducer(state =  {}, action){
    switch (action.type) {
        case "OPEN_SEND_HINT": {
            return { ...state, sendHintOpen: true, data: action.payload };
        }
        case "CLOSE_SEND_HINT": {
            return { ...state, sendHintOpen: false };
        }
        default: break;
    }
    return { ...state };
}