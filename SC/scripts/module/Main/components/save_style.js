const SaveStylePage = (S, change) => {

    return S(DIV).append(
        S(SPAN, '.page_title').html('Стилизация'),

        S(SPAN, ['.big_text_size', '.page_sub_title']).html('3.1 Вариативность в выборе'),

        textBlock([
            'Прежде чем мы начнём познавать стилизацию, давайте сразу отметим важный момент.',
        ]),

        textBlock([
            'Не смотря что мы всегда использовали подключение стилизации, вас не принуждают её использовать!', 
            'Напротив, делайте так как вам в данный момент будет удобно, со стороны документации лишь правильно было бы напомнить, как её выключить:',
        ]),

        codeBlock(
`const s = new MicroComponent().use();
// или более явно
const s = new MicroComponent({ mutateCSS: false }).use([''])
`, 'js'),

        textBlock([
            'Соответственно, вы абсолютно так же используете функции библиотеки, но классы будут сохранять месторасположение в области видимости документа, конечно свои оригинальные названия тоже.'
        ]),

        alertBlock('Легко', [
            'Сложность работы со стилями в Micro Component закончится на этапе настройки объекта. Поскольку это информация из прошлых разделов, вы уже представляете как его настроить.'
        ]),

        S(SPAN, ['.big_text_size', '.page_sub_title']).html('3.2 Работа с областью видимости'),

        textBlock([
            'Работа с контекстом как уже говорилось является самой сложной частью библиотеки. Разбирая Micro Component даже поверхностно можно понять, что она сделана так чтобы не выделятся на общем фоне уже написанного кода на JQuery или стараться быть на него сильно похожей в этапе написание новой веб страницы. Это часть требований которая предъявлялась при её разработке.',
            'Но то что проиходит вокруг интересующих нас элементов, отличается не написанием кода, а его пониманием.'
        ]),

        alertBlock('Понимание', [
            'Micro Component очень трудно полностью раскрыть, если контекст вызова не управляется правильно. Пожалуйста, будьте особенно внимательны к этой части документации.'
        ]),

        textBlock([
            'Хоть в этой документации еще будет серьёзно затронут вопрос контекста в разделе про работе с состоянием, тут мы впервые серьёзно с ним сталкиваемся и давайте сразу начнём с примера, чтобы иметь представление о чем речь, но для повышения понимания работы, сделаем так как делать не имеет особого смысла:',
        ]),

        codeBlock(
`const s1 = new MicroComponent({ mutateCSS: true }).use(['example.css']);
s1('DIV', '.class').html('Первый элемент');

const s2 = new MicroComponent({ mutateCSS: true }).use(['example.css']);
s2('DIV', '.class').html('Второй элемент');
`,  'js'),

        textBlock([
            'И сразу посмотрим что получилось.'
        ]),

        codeBlock(
`<div class="SC_class-lx9DDp" sc="60830259375g0aYlk">Первый элемент</div>

<div class="SC_class-jDeIDI" sc="60830262446UygU6U">Второй элемент</div>`, 'html'
        ),

        textBlock([
            'Сразу что можно отметить, это имена классов. Они поменяли свои названия и теперь класс который натурально находится в одном документе css называется по разному. Так же, что тоже следует отметить разный атрибут sc, которому мы обязательно вернёмся позже.',
            'Что нас сейчас интересует, что классы css, приобрели свою область видимости в контексте документа и теперь не перекрываются друг с другом, точнее так было бы, если бы мы правильно начали работать с контекстом. В нашем примере, Micro Component сделает все так, но поскольку стили в этом классе не поменялись, как вы могли догадаться, такое преобразование не принесёт результатов.',
        ]),

        alertBlock('Справка', [
            'В целом, делать так даже вредно. Не критично, ничего не сломается, но вредно.',
            'Дело в том, что Micro Component при обработки класса выделяет его и помещает в отдельную свою область видимости, из которой он и будет брать необходимые стили. Такая реализация, заставит его сделать по сути клон одного класса. Это немногая, но всё же пустая трата памяти.'
        ]),
        
        textBlock([
            'Давайте теперь сразу сделаем правильно, чтобы исправить наше положение:'
        ]),

        codeBlock(
`const s1 = new MicroComponent({ mutateCSS: true }).use(['example.css']);
s1('DIV', '.class').html('Первый элемент');

const s2 = new MicroComponent({ mutateCSS: true }).use(['example_two.css']);
s2('DIV', '.class').html('Второй элемент');
`,  'js'),

        textBlock([
            'Вот теперь действительно появляется смысл в том что мы сделали. Ведь, мы не строили большие и сложные имена, мы сделали безопасную область памяти, где даже в через N лет работы, создавая класс который потенциально может перекрыть или быть перекрытым стилями старого, этого уже не случиться, так как этот класс будет всегда сохранён как уникальная сущность.',
            'Сразу стоит отметить, что в параметр метода .use() мы передаём массив названий файлов, это значит что мы вполне можем использовать неограниченую область в файлах, и подключить в один модуль Micro Component, 2 или 3 файла, из разных частей веб страницы.'
        ]),

        codeBlock(
`const s1 = new MicroComponent({ mutateCSS: true }).use(['example.css', 'example_two.css']);
s1('DIV', ['.class_one', '.class_two']).html('Первый элемент');
`,  'js'),

        alertBlock('Справка', [
            'Важно понимать, что в пределах одной области видимости классы должны иметь уникальные названия.',
        ]),

        S(SPAN, ['.big_text_size', '.page_sub_title']).html('3.3 Инструкции'),

        textBlock([
            'Мы уже несколько раз сталкивались с реализацией, где мы передаём массив аргументов при передачё названий классов. Давайте уже разберёмся, что это такое!',
            'Если отвечать прямо, дело в том что Micro Component считает название класса инструкцией. Для него эти имена классов выглядят по другому, как мы уже могли наблюдать их в примерах html кода.',
        ]),

        textBlock([
            'Инструкций бывает несколько, и они могут быть применены к элементам которые прошли регистрацию Micro Component.',
            'Давайте посмотрим на список:'
        ]),

        codeBlock(
`S('DIV', '.my-class'); // добавить класс - SC_my-class-f0bBOP
S('DIV', '-my-class'); // удалить класс - SC_my-class-f0bBOP
S('DIV', '*remove'); // удалить элемент
S('DIV', '*empty'); // удалить всех детей у элемента
S('DIV', '!class'); // удалить все классы у элемента
S('DIV', '!line'); // удалить все inline стили у элемента
`,  'js'),

        textBlock([
            'Всё это довольно просто, но это повторяет функционал, который по другому можно написать на чистом JQuery, вполне это действительно так. Может немного большим размером кода, но можно, тем не менее установка такого подхода вопрос не только удобства, есть определённый смысл его использовать для организации динамической стилизации, о чем мы подробнее будем говорить в разделе "Локальное состояние", сейчас будет продуктивнее если мы сразу обратим внимание на синтаксис в котором мы используем массив инструкций.',
        ]),

        codeBlock(
`// Тут мы хотим найти уже существующий элемент, и добавить ему 2 класса, удалить hide_class, и все строчные стили.
S($('#element'), [".my-class", ".my-class_two", "-hide_class", "!line"]); 
`,  'js'),

        textBlock([
            'Довольно просто, тут нечего добавить, просто используйте массив инструкций - когда вам это необходимо.',
            'О чём действительно бы хотелось упоминуть, это о целесообразности использования массива инструкций в таком виде в каком он был выше использован. Ведь стоит заметить, что такая реализация не улучшает читаемость кода, особенно, для людей которые могут работать с вами над другой частью проекта, и не знать Micro Component. Такое написание, особенно в нескольких элементах подряд, на субъективный взгляд автора негативно влияет на читаемость кода, поэтому лучшей альтенативой будет использовать метод с которым вы уже встречались ранее:',
        ]),

        codeBlock(
`// Тут мы делаем тоже самое.
S($('#element')).MCadd('.my-class')
            .MCadd('.my-class_two')
            .MCadd('-hide_class')
            .MCadd('!line')
`,  'js'),

        textBlock([
            'Как вы можете догадаться, метод использованый выше создан просто для улучшения читаемости добавления разных инструкций. Это не значит что массив инструкций не нужен ведь он разрабатывался для иных целей с которыми мы познакомимся далее, а его использование здесь просто открытая для вас возможность.'
        ]),

        alertBlock('.MCadd', [
            'MCadd - это и .removeClass, и .addClass в одном лице, это связано с тем, как работает стилизация в Micro Component.',
            'Инструкции не могут быть записаны в этот метод в виде массива, одна инструкция на вызов.'
        ]),

        textBlock([
            'Стилизация в области библиотеки действительно простая вещь. Как правило вы используете отдельный файл под стилизацию Micro Component и выделяете весь CSS который должен стать безопасным. Однако, вы можете использовать и уже написанный код из разных частей ваших проектов если в этом есть необходимость.',
            'О чём следует упоминуть пользователя библиотеки, это чаще смотреть в консоль браузера. Micro Component следит за тем что он мутирует и что контролирует, поэтому вас предупредят заранее какого класса не хватает, а какие повторяются в одной области видимости. Так что вы сможете точно настроить работу вашей страницы без неожиданных результатов в производстве.',
            'Помните, что в разделе "Развитие", вы можете узнать, как удобно для вас указать на возможные ошибки или дать хорошую идею исходя из вашего опыта кодирования.'
        ]),

        S(SPAN, ['.big_text_size', '.page_sub_title']).html('3.4 deleteNativeCSS'),

        textBlock([
            'Хотелось сделать этому параметру отдельное упоминание.',
            'Как вы уже поняли из предыдущего опыта работы с документацией или возможно по названию, данный параметр который мы передаём при инициализации компонента - удаляет код CSS который мы писали, чтобы создать новый с уникальными названиями.',
            'Этот параметр нужно использовать с умом. Ведь может возникнуть ситуации когда стили css будут пересекаться и могут испортить ваш css. То есть не смотря на то, что вы защитите элемент к которому вы применили функции Micro Component, вы можете повредить элементы которые остались без его защиты.',
            'В таком случае активация этой опции удалит ваш собственный css, который мог бы переопределить другой css в коде за пределами Micro Component, и внешние элементы будут вне зоны риска.',
            'С другой стороны, иногда может возникнуть необходимость использовать стили в Micro Component и вне его. Поэтому активация этого параметра, хоть и не поменяет элементы которые стилизованны с помощью библиотеки, сделает для внешнего элемента css недоступным.',
            'Поэтому при использовании вы должны задуматься, а в каком контексте я хочу использовать тот или иной css код ? Чаще проще и безопаснее создать отдельный файл css для стилизации через Micro Component и удалить его родной css.'
        ]),

        alertBlock('Именование', [
            'При создании файла для стилизации только через Micro Component и удалении его стилей важно указать маркер, что файл был создан для этой цели. Попробуйте указать это в имени файла или оставить комментарии в самом .css, а может быть, лучше сделать и то, и другое.',
            'Если вы работаете в команде и ваш коллега не знает, что стили будут удалены при инициализации страницы, он может попытаться получить к ним доступ и потерпеть неудачу.',
            'Будьте осторожны.'
        ]),

        textBlock([
            'Но на практике бывают разные ситуации и возможно вам не подойдет такое решение.',
            'Нам пора двигаться дальше. Со следующей главы, начинаются самые интересные и сложные, но действительно полезные части библиотеки.'
        ]),

        S(DIV, '.link_button_block').append(
            S(SPAN, '.link_button').html('Состояние: Локальное состояние ⟶').on('click', () => {
                change('local_state');
            })
        ),
    );  
}