import Polyglot from 'node-polyglot';

declare module '@cabify/redux-polyglot' {
    type PolyglotInterpolationOptions = Polyglot.InterpolationOptions;

    type translate = (
        phrase: string,
        smartCountOrInterpolationOptions?: number | PolyglotInterpolationOptions
    ) => string;

    interface SimpleAction {
        type: string;
        payload: {
            [varName: string]: any;
        };
    }

    type getLocaleFunction = (action: SimpleAction) => string;
    type getPhrasesFunction = (locale: string) => Promise<any>;

    interface ReduxPolyglot {
        t: translate;
        tc: translate;
        tm: translate;
        tu: translate;
        ut: translate;
        has: (scope: string) => boolean;
        locale: () => string;
        extend: (phrases: any) => void;
        getDeeperScope: (scope: string) => ReduxPolyglot;
    }
    function getP(state: any, options?: getPParams): ReduxPolyglot;

    interface getPParams{
        polyglotScope: string;
        [any: string]: any;
    }

    function createPolyglotMiddleware(
        actionsToCatch: [string],
        getLocale: getLocaleFunction,
        getPhrases: getPhrasesFunction
    );

    interface PolyglotState {
        locale: string | null;
        phrases: any;
    }

    function polyglotReducer(state: PolyglotState, action: SimpleAction): PolyglotState;

    function useP(config?: getPParams): ReduxPolyglot;
}
