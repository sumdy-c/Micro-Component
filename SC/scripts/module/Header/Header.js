const Header = function() {
    const S = new MicroComponent({ mutateCSS: true, deleteNativeCSS: true, progressiveVar: true }).use(['header.css']);

    return (
        S(DIV, '.header').append(
            S(DIV, '.version').html('version 0.0.0 (pre-alpha)'),
            S(DIV, '.title').html('Micro Component'),
            S(DIV, '.sub_title').html('JQuery plugin'),
        )
    );
}