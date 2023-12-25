const Footer = function() {
    const S = new MicroComponent({ mutateCSS: true, deleteNativeCSS: true, progressiveVar: true }).use(['footer.css']);

    return (
        S(FOOTER, '.footer').append(
            S(DIV)
        )
    );
}