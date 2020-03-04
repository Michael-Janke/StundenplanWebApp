import { useSelector } from 'react-redux';

export default function useIsScope(scope = "teacher") {
    const isScope = useSelector(state => state.user.type === scope);
    return isScope;
}