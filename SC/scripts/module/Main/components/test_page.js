const TestPage = (S) => {

    const TEST = new State('first', 'ckskdfjgk');
    const ST = new State('second');
    const CHILD_CHILD = new State('third');

    return S('DIV').append(
        
        S(TEST, (test, C) => {
            // console.log('Основной');
            return S('DIV').html(test + ' ' + CHILD_CHILD.get()).append(
                C(ST, (st) => {
                    // console.log('Дочерний');
                    // console.log(st)
                    return S('DIV').html(st).append(
                        S(DIV).html(CHILD_CHILD.get())
                    )
                })
            )
        }, [CHILD_CHILD]),

        S(BUTTON).text('ДОЧ ДОЧ').on('click', () => {
            CHILD_CHILD.set("Новые данные");
        })
    );
}