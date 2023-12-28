let S;

const alertBlock = (title, arrText) => {
    if(!S) {
        S = GetMicroStateComponents('main.css');
    }
    return(
        S(DIV, '.page_text__block').append(
            S(SPAN, '.page_sub_title').text(title),
            S(DIV, '.page_text__content').append(
                arrText.map((text) => {
                    return S(P).text(text)  
                })
            )
        )
    )
};

const textBlock = (arrText) => {
    if(!S) {
        S = GetMicroStateComponents('main.css');
    }
    return arrText.map((text) => {
        return S(SPAN, '.page_text').html(text)
    })
}

const codeBlock = (code, title) => {
    if(!S) {
        S = GetMicroStateComponents('main.css');
    }

    return(
        S(DIV, '.page_code_block').append(
            title && S(SPAN, '.page_sub_title').html(title),
            S(DIV, '.page_code__content').append(
                S('<code>').text(code)
            )
        )
    )
};