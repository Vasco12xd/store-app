import transactionReducer, {
    setLoading,
    setResult,
    setError,
    clearResult,
    TransactionResult,
} from './transactionSlice';

const mockResult: TransactionResult = {
    transactionId: 'tx-1',
    wompiTransactionId: 'wompi-123',
    status: 'APPROVED',
    deliveryId: 'del-1',
};

describe('transactionSlice', () => {
    const initialState = {
        result: null,
        loading: false,
        error: null,
    };

    it('should return initial state', () => {
        expect(transactionReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('should handle setLoading true', () => {
        const state = transactionReducer(initialState, setLoading(true));
        expect(state.loading).toBe(true);
    });

    it('should handle setLoading false', () => {
        const state = transactionReducer({ ...initialState, loading: true }, setLoading(false));
        expect(state.loading).toBe(false);
    });

    it('should handle setResult', () => {
        const state = transactionReducer(initialState, setResult(mockResult));
        expect(state.result).toEqual(mockResult);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
    });

    it('should handle setError', () => {
        const state = transactionReducer(
            { ...initialState, loading: true },
            setError('Error al procesar')
        );
        expect(state.error).toBe('Error al procesar');
        expect(state.loading).toBe(false);
    });

    it('should handle clearResult', () => {
        const stateWithResult = {
            result: mockResult,
            loading: false,
            error: 'some error',
        };
        const state = transactionReducer(stateWithResult, clearResult());
        expect(state.result).toBeNull();
        expect(state.error).toBeNull();
    });

    it('should handle APPROVED status', () => {
        const approved = { ...mockResult, status: 'APPROVED' as const };
        const state = transactionReducer(initialState, setResult(approved));
        expect(state.result?.status).toBe('APPROVED');
    });

    it('should handle DECLINED status', () => {
        const declined = { ...mockResult, status: 'DECLINED' as const };
        const state = transactionReducer(initialState, setResult(declined));
        expect(state.result?.status).toBe('DECLINED');
    });
});