const TEST = new State('first', 'ckskdfjgk');
const ST = new State('second');
const CHILD_CHILD = new State('third');
const DF = new State('cvadra');
const FIVE = new State('five');
const SIX = new State('six');

const TestPage = (S) => {

    return S('DIV').append(
        S(TEST, (test) => {
            return S(DIV).css({ backgroundColor: 'red' }).text(`Я второй основной ${test}`);
        }),
        
        S(TEST, (test) => {
            return S('DIV').css({ backgroundColor: 'green' }).html(`Я первый основной ${test} ${CHILD_CHILD.get() + ' ' + FIVE.get()}`);
        }),

        S(CHILD_CHILD, (ch) => {
            return S(DIV).html('Я самостоятельный' + " " + ch)
        }),

        S(TEST, (test) => {
            return S(DIV).html('Я независимый' + " " + CHILD_CHILD.get())
        }),

        S(BUTTON).text('FIVE').on('click', () => {
            FIVE.set(Date.now());
        }),

        S(BUTTON).text('CHILD_CHILD').on('click', () => {
            CHILD_CHILD.set(Date.now());
        }),

        S(BUTTON).text('parent').on('click', () => {
            TEST.set(Date.now());
        }),
    );
}