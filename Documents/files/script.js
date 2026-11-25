/*
 * Portal dos Direitos Humanos - funcionalidades
 *  1. Tela de entrada (demonstração, sem autenticação real)
 *  2. Menu responsivo (botão "Menu" no celular)
 *  3. Barra de pesquisa com índice de temas e seções
 */
(function () {
    "use strict";

    // ---------- utilitários ----------

    function $(sel) { return document.querySelector(sel); }

    function normalizar(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // ---------- 1. TELA DE ENTRADA ----------

    function iniciarLogin() {
        var formLogin = $("#form-login");
        var formCriar = $("#form-criar");
        var painelRec = $("#painel-recuperar");
        var painelCriar = $("#painel-criar");
        var formRec = $("#form-recuperar");

        if (!formLogin) return;

        var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function mensagem(el, texto, ok) {
            el.textContent = texto;
            el.className = "mensagem-login " + (ok ? "ok" : "erro");
        }

        function validarEmailSenha(emailEl, senhaEl, msgEl) {
            var email = emailEl.value.trim();
            var senha = senhaEl.value;
            if (!REGEX_EMAIL.test(email)) {
                mensagem(msgEl, "Informe um e-mail válido.", false);
                return false;
            }
            if (senha.length < 6) {
                mensagem(msgEl, "A senha precisa ter pelo menos 6 caracteres.", false);
                return false;
            }
            return true;
        }

        // Entrar: demonstração, leva para a página principal
        formLogin.addEventListener("submit", function (event) {
            event.preventDefault();
            var msg = $("#msg-login");
            if (!validarEmailSenha($("#login-email"), $("#login-senha"), msg)) return;
            window.location.href = "inicio.html";
        });

        // Esqueceu sua senha? (mostra o painel de recuperação)
        $("#link-esqueci").addEventListener("click", function (event) {
            event.preventDefault();
            painelCriar.hidden = true;
            painelRec.hidden = false;
            $("#rec-email").focus();
        });

        $("#fechar-recuperar").addEventListener("click", function () {
            painelRec.hidden = true;
        });

        formRec.addEventListener("submit", function (event) {
            event.preventDefault();
            var email = $("#rec-email").value.trim();
            var msg = $("#msg-recuperar");
            if (!REGEX_EMAIL.test(email)) {
                mensagem(msg, "Informe um e-mail válido.", false);
                return;
            }
            mensagem(msg, "Demonstração: em um portal real, enviaríamos as instruções para " + email + ".", true);
        });

        // Criar conta: mostra o painel de cadastro
        $("#link-criar").addEventListener("click", function (event) {
            event.preventDefault();
            painelRec.hidden = true;
            painelCriar.hidden = false;
            $("#criar-nome").focus();
        });

        $("#fechar-criar").addEventListener("click", function () {
            painelCriar.hidden = true;
        });

        formCriar.addEventListener("submit", function (event) {
            event.preventDefault();
            var msg = $("#msg-criar");
            if (!$("#criar-nome").value.trim()) {
                mensagem(msg, "Informe seu nome.", false);
                return;
            }
            if (!validarEmailSenha($("#criar-email"), $("#criar-senha"), msg)) return;
            window.location.href = "inicio.html";
        });
    }

    // ---------- 2. MENU RESPONSIVO ----------

    function iniciarMenu() {
        var botao = $(".menu-toggle");
        var menu = $("#menu-principal");
        if (!botao || !menu) return;

        botao.addEventListener("click", function () {
            var aberto = menu.classList.toggle("aberto");
            botao.setAttribute("aria-expanded", aberto ? "true" : "false");
        });
    }

    // ---------- 3. PESQUISA ----------

    // Índice de busca: títulos, endereços e palavras-chave de cada tema e seção
    var INDICE = [
        { titulo: "Página inicial", url: "inicio.html", termos: "inicio portal banner noticias informacoes datas" },
        { titulo: "Direito à Educação", url: "educacao.html", termos: "educacao escola ensino estudo ldb fundamental gratuito creche educacao infantil" },
        { titulo: "Educação: leis que garantem o direito", url: "educacao.html#leis", termos: "constituicao lei ldb eca estatuto pessoa deficiencia inclusiva" },
        { titulo: "Direito à Saúde", url: "saude.html", termos: "saude sus publica atendimento ubs samu atencao basica medicamentos" },
        { titulo: "Saúde: Constituição e direito à saúde", url: "saude.html#constituicao", termos: "constituicao artigo 196 lei 8080 universalidade integralidade equidade" },
        { titulo: "Direito à Liberdade", url: "liberdade.html", termos: "liberdade expressao pensamento religiosa religiao opiniao consciencia credo" },
        { titulo: "Liberdade: opiniões diferentes e respeito", url: "liberdade.html#respeito", termos: "opiniao respeito diferenca discurso odio dialogo" },
        { titulo: "Direito à Igualdade", url: "igualdade.html", termos: "igualdade racismo discriminacao diversidade oportunidades preconceito genero deficiencia" },
        { titulo: "Igualdade: combate ao racismo", url: "igualdade.html#racismo", termos: "racismo lei 7716 estatuto igualdade racial crime" },
        { titulo: "Direito à Moradia", url: "moradia.html", termos: "moradia habitacao casa digna saneamento seguranca cidade estatuto cidade" },
        { titulo: "Moradia: saneamento básico", url: "moradia.html#saneamento", termos: "saneamento agua esgoto coleta residuos marco legal" },
        { titulo: "Direito ao Trabalho", url: "trabalho.html", termos: "trabalho emprego trabalhador salario jornada digno oit clt" },
        { titulo: "Trabalho: trabalho infantil e exploração", url: "trabalho.html#infantil", termos: "trabalho infantil exploracao escravo crianca adolescente denuncia" },
        { titulo: "Saiba Mais: fontes oficiais", url: "inicio.html#saiba-mais", termos: "links fontes oficiais onu unicef planalto gov mdh pesquisa" },
        { titulo: "Onde denunciar violações", url: "inicio.html#denuncias", termos: "denuncia disque 100 180 violacao ajuda apoio" }
    ];

    function pesquisar(consulta) {
        var palavras = normalizar(consulta).split(/\s+/).filter(function (p) { return p; });
        if (palavras.length === 0) return [];
        return INDICE.filter(function (item) {
            var alvo = normalizar(item.titulo + " " + item.termos);
            return palavras.every(function (p) { return alvo.indexOf(p) !== -1; });
        });
    }

    function mostrarResultados(consulta) {
        var caixa = $("#resultados-busca");
        if (!caixa) return;

        var resultados = pesquisar(consulta);
        caixa.textContent = "";

        var conteudo = document.createElement("div");
        conteudo.className = "resultados-caixa";

        var titulo = document.createElement("h2");
        titulo.textContent = resultados.length
            ? "Resultados para \u201C" + consulta + "\u201D"
            : "Nenhum resultado para \u201C" + consulta + "\u201D";
        conteudo.appendChild(titulo);

        if (resultados.length === 0) {
            var dica = document.createElement("p");
            dica.textContent = "Tente outras palavras, como: educação, saúde, liberdade, igualdade, moradia ou trabalho.";
            conteudo.appendChild(dica);
        } else {
            var lista = document.createElement("ul");
            resultados.forEach(function (item) {
                var li = document.createElement("li");
                var link = document.createElement("a");
                link.href = item.url;
                link.textContent = item.titulo;
                li.appendChild(link);
                lista.appendChild(li);
            });
            conteudo.appendChild(lista);
        }

        var fechar = document.createElement("button");
        fechar.type = "button";
        fechar.className = "botao botao-claro";
        fechar.textContent = "Fechar resultados";
        fechar.style.marginTop = "14px";
        fechar.addEventListener("click", function () {
            caixa.hidden = true;
        });
        conteudo.appendChild(fechar);

        caixa.appendChild(conteudo);
        caixa.hidden = false;
        caixa.focus && caixa.setAttribute("tabindex", "-1");
        caixa.focus && caixa.focus();
    }

    function iniciarBusca() {
        var form = $("#form-busca");
        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var consulta = $("#busca").value.trim();
            if (!consulta) {
                $("#busca").focus();
                return;
            }
            mostrarResultados(consulta);
        });
    }

    // ---------- inicialização ----------

    function iniciar() {
        iniciarLogin();
        iniciarMenu();
        iniciarBusca();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
