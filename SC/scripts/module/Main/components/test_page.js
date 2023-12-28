const TestPage = (S, change, HI) => {

    const TEST = new State('TEXT');
    const ST = new State('sdsasd');
    const Sdf = new State('sdsasd');

    // Сделать зависимости, учесть что у зависимых контейнеров может быть свой контейнер, со своими завимимостями.
    // Прокидываение родителем управления, от контролёров


    return S('DIV').append(
        
        S(TEST, (test, CHILD) => {
            return S(DIV).css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).append(
                S(SPAN).html(`TEST ` +  test),
                S(SPAN).html(ST.get()),
                
                CHILD(ST, (st, CHILD) => {   
                        return S(DIV).css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).append(
                            S(SPAN).html(`TEST ` +  st),
                            // CHILD()
                            S(SPAN).html(`TEST ` +  test),
                        )
                    }
                ),

            )
        }),

        // S(Sdf, (sdf) => {
        //     console.log('render')
        //     console.log(ST.get());
        //     return S(DIV).css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).append(
        //         S(SPAN).html(`TESTsdsd ` +  sdf),
        //         S(SPAN).html(ST.get()),
        //     )
        // }, [ST]),

        S(BUTTON).html('TEST').on('click', () => {
            const rand = Date.now();
            TEST.set(rand);
        }),

        S(BUTTON).html('ST').on('click', () => {
            const rand = Date.now();
            ST.set(rand);
        })

    );
}