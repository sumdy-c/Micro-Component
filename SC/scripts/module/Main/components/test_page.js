const TestPage = (S) => {

    const TEST = new State('first', 'ckskdfjgk');
    const ST = new State('second');
    const CHILD_CHILD = new State('third');
    const DF = new State('cvadra');
    const FIVE = new State('five');
    const SIX = new State('six');

    return S('DIV').append(

        // S(FIVE, (ch) => {
        //     return S(DIV).html('Я самостоятельный' + " " + ch)
        // }),


        // если расскоментить контейнер бага не будет, сначала юиды поправь, потом этим занимайся.
        // S(CHILD_CHILD, (ch) => {
        //     return S(DIV).html('Я самостоятельный' + " " + ch)
        // }),

        S(TEST, (test, B) => {
            return S(DIV).css({ backgroundColor: 'red' }).text(`Я второй основной ${test}`).append(
                B(ST, (ass) => {
                    return S('DIV').html(`Я второй дочерний ${CHILD_CHILD.get() + ' ' + FIVE.get()}`)
                })
            )
        }, []),
        
        S(TEST, (test, C) => {
            return S('DIV').css({ backgroundColor: 'green' }).html(`Я первый основной ${test} ${CHILD_CHILD.get() + ' ' + FIVE.get()}`).append(
                C(ST, (st, CC) => {
                    return  S(DIV).html(`Я первый дочерний ${st + ' ' + CHILD_CHILD.get() + ' ' + TEST.get()}`)
                    .append(
                        CC(DF, (df, FF) => {
                            return S(DIV).html(df + ' ' + CHILD_CHILD.get() + ' ' + FIVE.get()).append(
                                FF(SIX, (six) => {
                                    return S(DIV).html(six + ' ' + FIVE.get() + ' ' + TEST.get());
                                })
                            )
                        })
                    )
                })
            )
        }, [CHILD_CHILD]),

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