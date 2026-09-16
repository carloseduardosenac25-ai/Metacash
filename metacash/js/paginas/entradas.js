/* =========================================
        VERIFICAR USUÁRIO
========================================= */

const usuarioSalvo =
    localStorage.getItem("usuario");


if (!usuarioSalvo) {

    window.location.href =
        "../meta/index.html";

}


const usuario =
    JSON.parse(usuarioSalvo);


/* =========================================
        ELEMENTOS
========================================= */

const entradaForm =
    document.getElementById(
        "entradaForm"
    );

const mensagem =
    document.getElementById(
        "mensagem"
    );


/* =========================================
        DATA LOCAL
========================================= */

function obterDataLocal() {

    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");


    return `${ano}-${mes}-${dia}`;

}


/* =========================================
        FORMULÁRIO
========================================= */

entradaForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        /* =================================
                VALOR
        ================================== */

        const valor =
            parseFloat(
                document.getElementById(
                    "valor"
                ).value
            );


        /* =================================
                TIPO
        ================================== */

        const tipo =
            document.getElementById(
                "tipo"
            ).value;


        /* =================================
                DESCRIÇÃO
        ================================== */

        const descricao =
            document.getElementById(
                "descricao"
            ).value.trim();


        /* =================================
                VALIDAR VALOR
        ================================== */

        if (
            isNaN(valor) ||
            valor <= 0
        ) {

            mostrarMensagem(
                "Digite um valor válido.",
                "erro"
            );

            return;

        }


        /* =================================
                VALIDAR TIPO
        ================================== */

        if (!tipo) {

            mostrarMensagem(
                "Selecione o tipo de entrada.",
                "erro"
            );

            return;

        }


        /* =================================
                GARANTIR ARRAY
        ================================== */

        if (
            !Array.isArray(
                usuario.entradas
            )
        ) {

            usuario.entradas = [];

        }


        /* =================================
                CRIAR ENTRADA
        ================================== */

        const entrada = {

            id:
                Date.now(),

            valor:
                valor,

            tipo:
                tipo,

            descricao:
                descricao ||
                "Sem descrição",

            /*
                IMPORTANTE:

                usamos a data LOCAL,
                não UTC.
            */

            data:
                obterDataLocal()

        };


        /* =================================
                SALVAR
        ================================== */

        usuario.entradas.push(
            entrada
        );


        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );


        /* =================================
                MENSAGEM
        ================================== */

        mostrarMensagem(
            "Entrada adicionada com sucesso!",
            "sucesso"
        );


        /* =================================
                LIMPAR
        ================================== */

        entradaForm.reset();


        /* =================================
                REDIRECIONAR
        ================================== */

        setTimeout(
            function() {

                window.location.href =
                    "../meta/dashboard.html";

            },
            1000
        );

    }
);


/* =========================================
        MOSTRAR MENSAGEM
========================================= */

function mostrarMensagem(
    texto,
    tipo
) {

    if (!mensagem) {

        return;

    }


    mensagem.textContent =
        texto;


    mensagem.className =
        "mensagem " +
        tipo;

}