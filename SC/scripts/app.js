const App = () => {
    const S = new MicroComponent({ mutateCSS: true, deleteNativeCSS: true, progressiveVar: true }).use(['app.css']);

    const PAGE = new State('global_state');

    const BUTTONS = new State([
        {
            title: 'Приступая',
            isActive: false,
            alias: 'start'
        },
        {
            title: 'Установка',
            isActive: false,
            alias: 'install'
        },
        {
            title: 'Вызов и настройка',
            isActive: false,
            alias: 'settings'
        },
        {
            title: 'Подход к разработке',
            isActive: false,
            alias: 'dev'
        },
        {
            title: 'Безопасная стилизация',
            isActive: false,
            alias: 'save_style'
        },
        {
            title: 'Локальное состояние',
            isActive: false,
            alias: 'local_state'
        },
        {
            title: 'Глобальное состояние',
            isActive: true,
            alias: 'global_state'
        },
        {
            title: 'Тестовая страница',
            isActive: false,
            alias: 'test_page'
        },
    ]);

    const change = (param) => {
        const buttons = BUTTONS.get();
        
        buttons.forEach(button => {
            if(button.alias === param) {
                button.isActive = true;
                return;
            }
            button.isActive = false;
        });

        BUTTONS.set(buttons);

        PAGE.set(param);
    };

    S('#root').css({
        height: '100vh',
        width: '100vw'
    }).append(
        Header(),
        S(DIV, '.content').append(
            Aside(BUTTONS, change),
            Main(PAGE, change),
        ),
        Footer()
    );
};

document.addEventListener('DOMContentLoaded', _ => App());