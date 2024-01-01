const TestPage = (S) => {

    const TEST = new State('first', 'ckskdfjgk');
    const ST = new State('second');
    const CHILD_CHILD = new State('third');
    const DF = new State('cvadra');

    return S('DIV').append(

        S(TEST, (test, B) => {
            return S(DIV).css({ backgroundColor: 'red' }).text(`Я второй основной ${test}`).append(
                B(ST, (ass) => {
                    return S('DIV').html(`Я второй дочерний ${CHILD_CHILD.get()}`)
                })
            )
        }, [CHILD_CHILD]),
        
        S(TEST, (test, C) => {
            return S('DIV').css({ backgroundColor: 'green' }).html(`Я первый основной ${test} ${CHILD_CHILD.get()}`).append(
                C(ST, (st, CC) => {
                    return  S(DIV).html(`Я первый дочерний ${CHILD_CHILD.get() + " " + st}`)
                    .append(
                        CC(DF, (df) => {
                            return S(DIV).html(df + ' ' + CHILD_CHILD.get());
                        })
                    )
                })
            )
        }, [CHILD_CHILD]),

        S(TEST, (test) => {
            return S(DIV).html('Я независимый' + " " + CHILD_CHILD.get())
        }),


        S(CHILD_CHILD, (ch) => {
            return S(DIV).html('Я самостоятельный' + " " + ch)
        }),


        S(BUTTON).text('ДОЧ ДОЧ').on('click', () => {
            CHILD_CHILD.set(Date.now());
            // ST.set('Новые данные');
            // TEST.set('Новые данные');
        })
    );
}