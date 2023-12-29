const Aside = function(BUTTONS, change) {

    const S = new MicroComponent({ mutateCSS: true, deleteNativeCSS: true, progressiveVar: true }).use(['aside.css']);

    return (
        S(DIV, '.aside').append(
            S(BUTTONS, (buttons) => (
                S(DIV, '.button_container').append(
                    buttons.map((button) => {
                        return S(BUTTON, button.isActive ? '.button__active' : '.button')
                                    .attr('disable', button.isActive)
                                    .html(button.title)
                                    .on('click', button.isActive ? null : () => {
                                        change(button.alias);
                                    });
                    })
                )
            )),
            S(BUTTON).html('Получить состояние').on('click', () => {
                const instState = MCGet.GetState('ckskdfjgk');
                instState.set('РАБОТАЕТ!');
            })

        )
    )
}