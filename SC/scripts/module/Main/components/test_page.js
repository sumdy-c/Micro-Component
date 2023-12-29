const TestPage = (S, change, HI) => {

    const TEST = new State('first', 'ckskdfjgk');
    const ST = new State('second');
    const Sdf = new State('third');
    const RAW = new State('cvadra');
    const SF = new State('five');
    // Сделать зависимости, учесть что у зависимых контейнеров может быть свой контейнер, со своими завимимостями.
    // Прокидываение родителем управления, от контролёров


    return S('DIV').append(
        
        S(TEST, (test, CHILD) => {
            console.log('1')
            return S(DIV).css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).append(
                S(SPAN).html(`TEST ` +  test),
                
                CHILD(ST, (st, CHILD) => {
                    console.log('2')
                        return S(DIV).css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).append(
                            S(SPAN).html(`TEST_ДОЧЕРНИЙ ` +  st),
                            S(SPAN).html(`TEST_ДОЧЕРНИЙ_с значением предка ` +  TEST.get()),
                            
                            CHILD(Sdf, (sdf, CHILD) => {
                                console.log('3')
                                return S('DIV').css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).html(`TEST_ДОЧЕРНИЙ_ДОЧЕРНЕГО ` + sdf).append(
                                    CHILD(RAW, (raw) => {
                                        console.log('5')
                                        return S('DIV').css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).html(`TEST_ДОЧЕРНИЙ_ДОЧЕРНЕГО ` + raw).append(
                                            S(SPAN).html(`TEST ` + Sdf.get())
                                        )
                                    }),
                                    CHILD(RAW, (raw) => {
                                        console.log('5')
                                        return S('DIV').css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).html(`TEST_ДОЧЕРНИЙ_ДОЧЕРНЕГО_СОСЕД ` + raw).append(
                                            S(SPAN).html(`TEST ` + Sdf.get())
                                        )
                                    })
                                )
                            }),
                        )
                }),
            )
        }),

        S(RAW, (raw) => {
            return S('DIV').css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).html(`TEST_НЕ_ДОЧЕРНИЙ ` + raw)
        }),

        S(TEST, (test) => {
            return S('DIV').css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).html(`TEST_ЗАВИСИМОСТЬ ` + test).append(
                S(DIV).MCstate(SF, function(sf) {
                    if(sf !== 'five') {
                        this.target.css({
                            'background-color': 'antiquewhite',
                        })
                    };
                    return null;
                }).html(RAW.get()),

                S(DIV).html(ST.get()),

                S(BUTTON).html('пента рендер').on('click', () => {
                    const rand = Date.now();
                    SF.set(rand);
                })
            )
        }, [RAW, ST]),

        S(ST, (st) => {
            return S('DIV').css({'display': 'flex', 'flexDirection': 'column', 'margin' : '15px'}).html(`TEST_ЗАВИСИМОСТЬ_2 ` + st).append(
                S(DIV).html(RAW.get()),
            )
        }, [RAW]),

        S(BUTTON).html('первичный рендер').on('click', () => {
            const rand = Date.now();
            TEST.set(rand);
        }),

        S(BUTTON).html('вторичный рендер').on('click', () => {
            const rand = Date.now();
            ST.set(rand);
        }),

        S(BUTTON).html('третичный рендер').on('click', () => {
            const rand = Date.now();
            Sdf.set(rand);
        }),

        S(BUTTON).html('квадра рендер').on('click', () => {
            const rand = Date.now();
            RAW.set(rand);
        }),

        // S(BUTTON).html('Получить состояние').on('click', () => {
        //     const instState = MCGet.GetState('ckskdfjgk');
        //     instState.set('РАБОТАЕТ!');
        // })
    );
}