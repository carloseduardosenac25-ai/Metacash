/* =========================================
        USUÁRIO
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
        DADOS
========================================= */

const entradas =
    Array.isArray(usuario.entradas)
        ? usuario.entradas
        : [];

const gastos =
    Array.isArray(usuario.gastos)
        ? usuario.gastos
        : [];

const aportesMetas =
    Array.isArray(usuario.aportesMetas)
        ? usuario.aportesMetas
        : [];

const saldoInicial =
    Number(
        usuario.saldoInicial || 0
    );


/* =========================================
        ELEMENTOS
========================================= */

const elementoEntradas =
    document.getElementById(
        "relatorioEntradas"
    );

const elementoGastos =
    document.getElementById(
        "relatorioGastos"
    );

const elementoSaldo =
    document.getElementById(
        "relatorioSaldo"
    );

const detalheCategorias =
    document.getElementById(
        "detalhamentoCategorias"
    );

const selectMes =
    document.getElementById(
        "mesRelatorio"
    );

const selectAno =
    document.getElementById(
        "anoRelatorio"
    );


/* =========================================
        METODOLOGIA
========================================= */

const statusMetodologia =
    document.getElementById(
        "statusMetodologia"
    );

const percentualNecessidades =
    document.getElementById(
        "percentualNecessidades"
    );

const percentualLazer =
    document.getElementById(
        "percentualLazer"
    );

const percentualEconomia =
    document.getElementById(
        "percentualEconomia"
    );

const barraNecessidades =
    document.getElementById(
        "barraNecessidades"
    );

const barraLazer =
    document.getElementById(
        "barraLazer"
    );

const barraEconomia =
    document.getElementById(
        "barraEconomia"
    );

const feedbackNecessidades =
    document.getElementById(
        "feedbackNecessidades"
    );

const feedbackLazer =
    document.getElementById(
        "feedbackLazer"
    );

const feedbackEconomia =
    document.getElementById(
        "feedbackEconomia"
    );


/* =========================================
        GRÁFICOS
========================================= */

let graficoCategorias =
    null;

let graficoEntradasGastos =
    null;


/* =========================================
        CATEGORIAS DA METODOLOGIA
========================================= */

const categoriasNecessidades = [

    "Alimentação",
    "Transporte",
    "Estudos"

];


const categoriasLazer = [

    "Jogos",
    "Streaming",
    "Compras",
    "Lazer",
    "Figurinhas"

];


/* =========================================
        FORMATAR MOEDA
========================================= */

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================
        OBTER DATA
========================================= */

function obterData(data) {

    if (!data) {

        return null;

    }


    /* DD/MM/YYYY */

    if (
        data.includes("/")
    ) {

        const partes =
            data.split("/");


        if (
            partes.length !== 3
        ) {

            return null;

        }


        return {

            dia:
                Number(partes[0]),

            mes:
                Number(partes[1]) - 1,

            ano:
                Number(partes[2])

        };

    }


    /* YYYY-MM-DD */

    if (
        data.includes("-")
    ) {

        const partes =
            data.split("-");


        if (
            partes.length !== 3
        ) {

            return null;

        }


        return {

            dia:
                Number(partes[2]),

            mes:
                Number(partes[1]) - 1,

            ano:
                Number(partes[0])

        };

    }


    return null;

}


/* =========================================
        CARREGAR ANOS
========================================= */

function carregarAnos() {

    const anos =
        new Set();


    [
        ...entradas,
        ...gastos,
        ...aportesMetas
    ].forEach(
        function(item) {

            const data =
                obterData(
                    item.data
                );


            if (data) {

                anos.add(
                    data.ano
                );

            }

        }
    );


    anos.add(
        new Date().getFullYear()
    );


    const listaAnos =
        [...anos].sort(
            (a, b) => b - a
        );


    selectAno.innerHTML =
        "";


    listaAnos.forEach(
        function(ano) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                ano;


            option.textContent =
                ano;


            selectAno.appendChild(
                option
            );

        }
    );

}


/* =========================================
        FILTRAR POR PERÍODO
========================================= */

function filtrarPorPeriodo(
    lista,
    mesSelecionado,
    anoSelecionado
) {

    return lista.filter(
        function(item) {

            const data =
                obterData(
                    item.data
                );


            if (!data) {

                return false;

            }


            const anoCorreto =
                data.ano ===
                Number(
                    anoSelecionado
                );


            const mesCorreto =
                mesSelecionado ===
                    "todos"

                    ||

                data.mes ===
                    Number(
                        mesSelecionado
                    );


            return (
                anoCorreto &&
                mesCorreto
            );

        }
    );

}


/* =========================================
        ATUALIZAR RELATÓRIO
========================================= */

function atualizarRelatorio() {

    const mesSelecionado =
        selectMes.value;


    const anoSelecionado =
        selectAno.value;


    /* =====================================
            FILTRAR ENTRADAS
    ====================================== */

    const entradasFiltradas =
        filtrarPorPeriodo(
            entradas,
            mesSelecionado,
            anoSelecionado
        );


    /* =====================================
            FILTRAR GASTOS
    ====================================== */

    const gastosFiltrados =
        filtrarPorPeriodo(
            gastos,
            mesSelecionado,
            anoSelecionado
        );


    /* =====================================
            FILTRAR APORTES
    ====================================== */

    const aportesFiltrados =
        filtrarPorPeriodo(
            aportesMetas,
            mesSelecionado,
            anoSelecionado
        );


    /* =====================================
            TOTAL ENTRADAS
    ====================================== */

    const totalEntradas =
        entradasFiltradas.reduce(
            function(total, entrada) {

                return (
                    total +
                    Number(
                        entrada.valor || 0
                    )
                );

            },
            0
        );


    /* =====================================
            TOTAL GASTOS
    ====================================== */

    const totalGastos =
        gastosFiltrados.reduce(
            function(total, gasto) {

                return (
                    total +
                    Number(
                        gasto.valor || 0
                    )
                );

            },
            0
        );


    /* =====================================
            TOTAL APORTES
    ====================================== */

    const totalAportes =
        aportesFiltrados.reduce(
            function(total, aporte) {

                return (
                    total +
                    Number(
                        aporte.valor || 0
                    )
                );

            },
            0
        );


    /* =====================================
            SALDO DO PERÍODO
    ====================================== */

    const saldoAtual =
        saldoInicial +
        totalEntradas -
        totalGastos -
        totalAportes;


    /* =====================================
            BASE FINANCEIRA
    ====================================== */

    const baseFinanceira =
        saldoInicial +
        totalEntradas;


    /* =====================================
            RESUMO
    ====================================== */

    elementoEntradas.textContent =
        formatarMoeda(
            totalEntradas
        );


    elementoGastos.textContent =
        formatarMoeda(
            totalGastos
        );


    elementoSaldo.textContent =
        formatarMoeda(
            saldoAtual
        );


    /* =====================================
            GASTOS POR CATEGORIA
    ====================================== */

    const gastosPorCategoria =
        {};


    gastosFiltrados.forEach(
        function(gasto) {

            const categoria =
                gasto.categoria ||
                "Outros";


            const valor =
                Number(
                    gasto.valor || 0
                );


            if (
                !gastosPorCategoria[
                    categoria
                ]
            ) {

                gastosPorCategoria[
                    categoria
                ] = 0;

            }


            gastosPorCategoria[
                categoria
            ] += valor;

        }
    );


    /* =====================================
            DETALHAMENTO
    ====================================== */

    mostrarDetalhamento(
        gastosPorCategoria,
        totalGastos
    );


    /* =====================================
            GRÁFICOS
    ====================================== */

    atualizarGraficoCategorias(
        gastosPorCategoria
    );


    atualizarGraficoComparacao(
        totalEntradas,
        totalGastos,
        totalAportes
    );


    /* =====================================
            METODOLOGIA
    ====================================== */

    analisarMetodologia(
        gastosFiltrados,
        baseFinanceira,
        totalGastos,
        totalAportes
    );

}


/* =========================================
        DETALHAMENTO CATEGORIAS
========================================= */

function mostrarDetalhamento(
    gastosPorCategoria,
    totalGastos
) {

    detalheCategorias.innerHTML =
        "";


    const categorias =
        Object.entries(
            gastosPorCategoria
        );


    if (
        categorias.length === 0
    ) {

        detalheCategorias.innerHTML = `

            <div class="empty-report">

                <span>📊</span>

                <p>
                    Não existem gastos registrados
                    neste período.
                </p>

            </div>

        `;

        return;

    }


    categorias.sort(
        (a, b) => b[1] - a[1]
    );


    categorias.forEach(
        function([categoria, valor]) {

            const percentual =
                totalGastos > 0

                    ? (
                        valor /
                        totalGastos
                    ) * 100

                    : 0;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "category-detail";


            item.innerHTML = `

                <div class="category-detail-top">

                    <span
                        class="category-detail-name"
                    >

                        ${categoria}

                    </span>


                    <span
                        class="category-detail-value"
                    >

                        ${formatarMoeda(
                            valor
                        )}

                        ·

                        ${percentual.toFixed(
                            1
                        )}%

                    </span>

                </div>


                <div class="category-bar">

                    <div
                        class="category-bar-fill"
                        style="
                            width:
                            ${percentual}%;
                        "
                    ></div>

                </div>

            `;


            detalheCategorias.appendChild(
                item
            );

        }
    );

}


/* =========================================
        GRÁFICO CATEGORIAS
========================================= */

function atualizarGraficoCategorias(
    gastosPorCategoria
) {

    const canvas =
        document.getElementById(
            "graficoCategorias"
        );


    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {

        return;

    }


    const categorias =
        Object.keys(
            gastosPorCategoria
        );


    const valores =
        Object.values(
            gastosPorCategoria
        );


    if (
        graficoCategorias
    ) {

        graficoCategorias.destroy();

    }


    if (
        categorias.length === 0
    ) {

        return;

    }


    graficoCategorias =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",


                data: {

                    labels:
                        categorias,


                    datasets: [

                        {

                            data:
                                valores,


                            borderWidth:
                                2,


                            borderColor:
                                "#071022",


                            backgroundColor: [

                                "#00d68f",

                                "#6ecbff",

                                "#ffd166",

                                "#ff7f7f",

                                "#8c7ae6",

                                "#00b894",

                                "#fd79a8",

                                "#e17055"

                            ]

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            position:
                                "bottom",


                            labels: {

                                color:
                                    "#A8B2C4",

                                padding:
                                    18,

                                font: {

                                    family:
                                        "Poppins"

                                }

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================
        GRÁFICO ENTRADAS X GASTOS
========================================= */

function atualizarGraficoComparacao(
    totalEntradas,
    totalGastos,
    totalAportes
) {

    const canvas =
        document.getElementById(
            "graficoEntradasGastos"
        );


    if (
        !canvas ||
        typeof Chart === "undefined"
    ) {

        return;

    }


    if (
        graficoEntradasGastos
    ) {

        graficoEntradasGastos.destroy();

    }


    graficoEntradasGastos =
        new Chart(
            canvas,
            {

                type:
                    "bar",


                data: {

                    labels: [

                        "Entradas",

                        "Gastos",

                        "Metas"

                    ],


                    datasets: [

                        {

                            data: [

                                totalEntradas,

                                totalGastos,

                                totalAportes

                            ],


                            backgroundColor: [

                                "#4ade80",

                                "#ff8a8a",

                                "#6ecbff"

                            ],


                            borderRadius:
                                8,

                            borderWidth:
                                0

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,


                    scales: {

                        x: {

                            ticks: {

                                color:
                                    "#A8B2C4",

                                font: {

                                    family:
                                        "Poppins"

                                }

                            },


                            grid: {

                                display:
                                    false

                            }

                        },


                        y: {

                            beginAtZero:
                                true,


                            ticks: {

                                color:
                                    "#657084",


                                callback:
                                    function(valor) {

                                        return formatarMoeda(
                                            valor
                                        );

                                    }

                            },


                            grid: {

                                color:
                                    "rgba(255,255,255,0.05)"

                            }

                        }

                    },


                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    }

                }

            }
        );

}


/* =========================================
        METODOLOGIA
========================================= */

function analisarMetodologia(
    gastosFiltrados,
    baseFinanceira,
    totalGastos,
    totalAportes
) {


    if (
        baseFinanceira <= 0
    ) {

        percentualNecessidades.textContent =
            "0%";

        percentualLazer.textContent =
            "0%";

        percentualEconomia.textContent =
            "0%";


        barraNecessidades.style.width =
            "0%";

        barraLazer.style.width =
            "0%";

        barraEconomia.style.width =
            "0%";


        feedbackNecessidades.textContent =
            "Nenhum valor disponível para análise.";

        feedbackLazer.textContent =
            "Nenhum valor disponível para análise.";

        feedbackEconomia.textContent =
            "Nenhum valor disponível para análise.";


        statusMetodologia.className =
            "methodology-status";


        statusMetodologia.textContent =
            "Informe um saldo inicial ou registre uma entrada.";

        return;

    }


    let valorNecessidades =
        0;

    let valorLazer =
        0;


    gastosFiltrados.forEach(
        function(gasto) {

            const categoria =
                normalizarNome(
                    gasto.categoria ||
                    ""
                );


            const valor =
                Number(
                    gasto.valor || 0
                );


            if (
                categoriasNecessidades
                    .map(normalizarNome)
                    .includes(
                        categoria
                    )
            ) {

                valorNecessidades +=
                    valor;

            }


            else if (
                categoriasLazer
                    .map(normalizarNome)
                    .includes(
                        categoria
                    )
            ) {

                valorLazer +=
                    valor;

            }

        }
    );


    /*
        Aportes para metas reduzem
        o valor disponível para economia.
    */

    const valorEconomia =
        Math.max(
            baseFinanceira -
            totalGastos -
            totalAportes,
            0
        );


    const porcentagemNecessidades =
        (
            valorNecessidades /
            baseFinanceira
        ) * 100;


    const porcentagemLazer =
        (
            valorLazer /
            baseFinanceira
        ) * 100;


    const porcentagemEconomia =
        (
            valorEconomia /
            baseFinanceira
        ) * 100;


    percentualNecessidades.textContent =
        `${porcentagemNecessidades.toFixed(1)}%`;


    percentualLazer.textContent =
        `${porcentagemLazer.toFixed(1)}%`;


    percentualEconomia.textContent =
        `${porcentagemEconomia.toFixed(1)}%`;


    barraNecessidades.style.width =
        `${Math.min(
            porcentagemNecessidades,
            100
        )}%`;


    barraLazer.style.width =
        `${Math.min(
            porcentagemLazer,
            100
        )}%`;


    barraEconomia.style.width =
        `${Math.min(
            porcentagemEconomia,
            100
        )}%`;


    /* =====================================
            FEEDBACK NECESSIDADES
    ====================================== */

    if (
        porcentagemNecessidades <= 50
    ) {

        feedbackNecessidades.textContent =
            "✅ Dentro do limite planejado.";

    }
    else {

        feedbackNecessidades.textContent =
            "⚠️ Acima dos 50% planejados.";

    }


    /* =====================================
            FEEDBACK LAZER
    ====================================== */

    if (
        porcentagemLazer <= 30
    ) {

        feedbackLazer.textContent =
            "✅ Dentro do limite planejado.";

    }
    else {

        feedbackLazer.textContent =
            "⚠️ Acima dos 30% planejados.";

    }


    /* =====================================
            FEEDBACK ECONOMIA
    ====================================== */

    if (
        porcentagemEconomia >= 20
    ) {

        feedbackEconomia.textContent =
            "✅ Você atingiu a meta de economia.";

    }
    else {

        feedbackEconomia.textContent =
            "⚠️ Sua economia está abaixo de 20%.";

    }


    /* =====================================
            STATUS
    ====================================== */

    const necessidadesAcima =
        porcentagemNecessidades > 50;


    const lazerAcima =
        porcentagemLazer > 30;


    const economiaAbaixo =
        porcentagemEconomia < 20;


    if (
        !necessidadesAcima &&
        !lazerAcima &&
        !economiaAbaixo
    ) {

        statusMetodologia.className =
            "methodology-status success";


        statusMetodologia.textContent =
            "✅ Sua distribuição está dentro das metas 50/30/20.";

    }

    else {

        statusMetodologia.className =
            "methodology-status warning";


        if (
            necessidadesAcima &&
            lazerAcima
        ) {

            statusMetodologia.textContent =
                "⚠️ Necessidades e lazer estão acima do planejado.";

        }

        else if (
            necessidadesAcima
        ) {

            statusMetodologia.textContent =
                "⚠️ Necessidades estão acima dos 50% planejados.";

        }

        else if (
            lazerAcima
        ) {

            statusMetodologia.textContent =
                "⚠️ Lazer está acima dos 30% planejados.";

        }

        else {

            statusMetodologia.textContent =
                "⚠️ A economia está abaixo dos 20% planejados.";

        }

    }

}


/* =========================================
        EVENTOS
========================================= */

if (selectMes) {

    selectMes.addEventListener(
        "change",
        atualizarRelatorio
    );

}


if (selectAno) {

    selectAno.addEventListener(
        "change",
        atualizarRelatorio
    );

}


/* =========================================
        INICIALIZAÇÃO
========================================= */

carregarAnos();


if (selectMes) {

    selectMes.value =
        "todos";

}


if (selectAno) {

    selectAno.value =
        new Date().getFullYear();

}


atualizarRelatorio();