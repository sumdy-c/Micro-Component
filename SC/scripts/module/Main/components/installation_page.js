const InstallationPage = (S) => {
    
    return S(DIV).append(
        S(SPAN, '.page_title').html('Установка'),
        
        alertBlock('Варианты', 
            [
                'Ниже предоставлен список как вы можете получить Micro Component в свой проект.'
            ]
        ),

        alertBlock('CDN', 
            [`cdnjs`]
        ),

        alertBlock('NPM', 
            [   ' * Установка с jQuery',
                '-',
                '  npm install --jquery micro_component',
                '--',
                ' * Установка только Micro Component',
                '-',
                '  npm install micro_component',
            ]
        ),

        alertBlock('GitHub', 
            ['<a href="https://github.com/sumdy-c/MicroComponent">Посетить</a>']
        ),

        S(DIV, '.link_button_block').append(
            S(SPAN, '.link_button').html('Получить код').on('click', () => {
                window.location = '/lib/MC.js';
            })
        ),
    );
}