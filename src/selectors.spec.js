import { toUpper } from 'ramda';
import { getP, getLocale } from './selectors';

const fakeState = {
    polyglot: {
        locale: 'fr',
        phrases: {
            test: {
                hello: 'bonjour',
                hello_world: 'bonjour monde',
                errors: { invalid: 'invalide', nested: { other: 'thing' } },
            },
        },
    },
};

describe('selectors', () => {
    describe('getLocale', () => {
        it("doesn't crash when state is an empty object", () => {
            expect(getLocale({})).toBe(undefined);
        });

        it("doesn't crash when state is an empty object", () => {
            expect(getLocale(fakeState)).toBe('fr');
        });
    });

    describe('getP', () => {
        const p = getP(fakeState, { polyglotScope: 'test' });

        it('gives a valid redux-polyglot object', () => {
            expect(p).toMatchObject({
                phrases: expect.any(Object),
                currentLocale: 'fr',
                onMissingKey: null,
                warn: expect.any(Function),
                ut: expect.any(Function),
                t: expect.any(Function),
                tc: expect.any(Function),
                tt: expect.any(Function),
                tu: expect.any(Function),
                tm: expect.any(Function),
                has: expect.any(Function),
                locale: expect.any(Function),
                extend: expect.any(Function),
            });
        });

        it('returns phrase key if no locale defined', () => {
            expect(getP({})).toBeDefined();

            const emptyP = getP({});

            expect(emptyP.t('a.path.to.translate')).toEqual('a.path.to.translate');
        });

        it('translates "hello" to "bonjour"', () => {
            expect(p.t('hello')).toBe('bonjour');
        });

        it('translates "hello" to "Bonjour" (capitalize)', () => {
            expect(p.tc('hello')).toBe('Bonjour');
        });

        it('translates "hello world" to "Bonjour Monde" (titleize)', () => {
            expect(p.tt('hello_world')).toBe('Bonjour Monde');
        });

        it('translates "hello" to "BONJOUR" (upper-case)', () => {
            expect(p.tu('hello')).toBe('BONJOUR');
        });

        it('translates "hello" to "BONJOUR" (morphed with upper-case function)', () => {
            expect(p.tm(toUpper)('hello')).toBe('BONJOUR');
        });

        it('translates when scope is not given', () => {
            expect(getP(fakeState).t('test.hello')).toBe('bonjour');
            expect(getP(fakeState).tu('test.hello')).toBe('BONJOUR');
        });

        it('overwrite default scope translation "hello" to "Hi !"', () => {
            const p1 = getP(fakeState, {
                polyglotScope: 'test',
                ownPhrases: { 'test.hello': 'Hi !' },
            });
            expect(p1.tc('hello')).toBe('Hi !');
        });

        it('overwrite multiple default scope translations', () => {
            const p2 = getP(fakeState, {
                polyglotScope: 'test',
                ownPhrases: {
                    'test.hello': 'Hi !',
                    'test.hello_world': 'Hi WORLD !',
                },
            });

            expect(p2.tc('hello_world')).toBe('Hi WORLD !');
            expect(p2.tc('hello')).toBe('Hi !');
        });

        it('should allow unscoped translations', () => {
            expect(p.ut('test.hello')).toEqual('bonjour');
        });

        describe('using #has', () => {
            it('returns true if a key is in he phrases for the current scope', () => {
                expect(p.has('hello')).toBeTruthy();
            });

            it('returns false if a key isnt in the current scope', () => {
                expect(p.has('bye')).toBeFalsy();
            });

            it('returns false if no locale defined', () => {
                const emptyP = getP({});

                expect(emptyP.has('test.hello')).toBeFalsy();
            });
        });

        describe('#getDeeperScope', () => {
            let deeperP;
            beforeEach(() => {
                deeperP = p.getDeeperScope('errors');
            });

            it('should translate correctly', () => {
                expect(deeperP.t('invalid')).toEqual('invalide');
            });

            it('should check if an string exists correcly', () => {
                expect(deeperP.has('invalid')).toBeTruthy();
            });

            describe('when nesting again', () => {
                beforeEach(() => {
                    deeperP = deeperP.getDeeperScope('nested');
                });

                it('should translate correctly', async () => {
                    expect(deeperP.t('other')).toEqual('thing');
                });
            });
        });
    });
});
