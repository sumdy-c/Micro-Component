const TestPage = (S) => {

    const TEST = new State('first', 'ckskdfjgk');
    const ST = new State('second');
    const CHILD_CHILD = new State('third');
    const DF = new State('cvadra');
    const FIVE = new State('five');

    return S('DIV').append(

        // S(CHILD_CHILD, (ch) => {
        //     return S(DIV).html('Я самостоятельный' + " " + ch)
        // }),

        // S(FIVE, (ch) => {
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
            return S('DIV').css({ backgroundColor: 'green' }).html(`Я первый основной ${test} ${CHILD_CHILD.get()}`).append(
                C(ST, (st, CC) => {
                    return  S(DIV).html(`Я первый дочерний ${st + ' ' + CHILD_CHILD.get()}`)
                    .append(
                        CC(DF, (df, FF) => {
                            return S(DIV).html(df + ' ' + CHILD_CHILD.get() + ' ' + FIVE.get()).append(
                                // FF(FIVE, (five) => {
                                //     return S(DIV).html(five + ' ' + CHILD_CHILD.get());
                                // })
                            )
                        })
                    )
                })
            )
        }, [FIVE, CHILD_CHILD]),

        // S(CHILD_CHILD, (ch) => {
        //     return S(DIV).html('Я самостоятельный' + " " + ch)
        // }),

        S(TEST, (test) => {
            return S(DIV).html('Я независимый' + " " + CHILD_CHILD.get())
        }),

        S(BUTTON).text('1').on('click', () => {
            FIVE.set(Date.now());
            // ST.set('Новые данные');
            // TEST.set('Новые данные');
        }),

        S(BUTTON).text('2').on('click', () => {
            CHILD_CHILD.set(Date.now());
            // ST.set('Новые данные');
            // TEST.set('Новые данные');
        }),
    );
}