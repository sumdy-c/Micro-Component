const Main = function(PAGE, change) {
    const S = new MicroComponent({ mutateCSS: true, deleteNativeCSS: true, progressiveVar: true }).use(['main.css']);
  
    // разобрать стороние стейты
    const HI = new State({ text: 'Я только что создан!'});

    return (
        S(DIV, '.main').append(
            S(PAGE, (page) => {
                switch(page){
                    case 'start':
                        return StartPage(S, change, HI);
                    case 'install':
                        return InstallationPage(S, change);
                    case 'settings':
                        return SettingsPage(S, change);
                    case 'dev':
                        return DevPage(S, change);
                    case 'save_style':
                        return SaveStylePage(S, change);
                    case 'local_state':
                        return LocalStatePage(S, change);
                    case 'global_state':
                        return GlobalStatePage(S, change, HI);
                    case 'test_page':
                        return TestPage(S);
                }
            }),
        )
    );
}