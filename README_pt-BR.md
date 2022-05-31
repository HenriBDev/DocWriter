<p align="center">
    <img src="readmeFiles/document-3503099_960_720.png" alt="drawing" width="30%"/>
</p>

# <p align="center">DocWriter</p>

<p align="center"> DocWriter é o seu bot do Discord para ajudar a escrever documentos sem precisar sair do aplicativo</p>

<hr>

# Como funciona?

**Para usar o DocWriter basta seguir esses simples passos:**

1. Convide DocWriter para o seu servidor (No momento indisponível, mais informações em: [Auto-Hospedando o DocWriter](#auto-hospedando-o-docwriter))
2. Escreva uma mensagem que queira adicionar em seu documento
3. Use o comando `doc|addcontent` para incluir o texto no documento
4. Finalize o documento e gere um arquivo PDF usando o comando `doc|exportpdf <nome_do_arquivo>`

<p align="center">
    <img src="readmeFiles/demonstration.gif" alt="drawing" width="50%"/>
</p>

<hr>

# Comandos

DocWriter tem dois tipos de comandos: Comandos de utilidade e Comandos de formatação:

## Comandos de utilidade
**doc|addcontent** -> Adiciona a última mensagem ao documento sem finalizar a montagem

**doc|exportpdf** `<nome_do_arquivo>` -> Finaliza a montagem do documento e o exporta como PDF

**doc|fonts** -> Mostra todas as fontes disponíveis

**doc|help** -> Mostra todos os comandos disponíveis do DocWriter

**doc|onepagepdf** `<nome_do_arquivo>` -> Gera um arquivo de PDF de uma única página usando a última mensagem de texto do usuário

**doc|preview** -> Mostra uma visualização do documento atual

**doc|redo** -> Refaz a adição anteriormente desfeita

**doc|undo** -> Desfaz a adição anteriora no arquivo
<br><br>

## Comandos de formatação
**doc|align** `<right/left/center/justify>` -> Muda o alinhamento do conteúdo

**doc|bgcolor** `<cor_do_fundo>` -> Muda a cor de fundo da fonte (`<cor_do_fundo>` pode ser um nome ou um código hexadecimal, exemplo: #E0E0E0 ou lightblue) 

**doc|bold** -> Habilita/desabilita o negrito na fonte 

**doc|dashed** `<double/nada>` -> Habilita/desabilita tachado ou tachado duplo na fonte atual, adicione "double" como parâmetro para habilitar/desabilitar o tachado duplo

**doc|firstlineindent** `<indentação_da_linha/nada>` -> Muda/desabilita a indentação antes da primeira linha (medida em centímetros)

**doc|fontcolor** `<cor_da_fonte>` -> Muda a cor da fonte (`<cor_da_fonte>` pode ser um nome ou um código hexadecimal, exemplo: #E0E0E0 ou lightblue)  

**doc|fontfamily** `<familia_da_fonte>` -> Muda a atual família da fonte

**doc|fontsize** `<tamanho_da_fonte>` -> Muda o tamanho atual da fonte (medido em PTs)

**doc|italic** -> Habilita/desabilita itálico na fonte atual

**doc|lineheight** `<altura_da_linha>` -> Muda o tamanho das linhas (medido em centímetros)

**doc|overline** -> Habilita/desabilita sobrelinha na fonte atual

**doc|setmargins** `<margin_top/.> <margin_right/.> <margin_bottom/.> <margin_left/.>` -> Muda as medidas da margem  (use `.` se você não quiser mudar, exemplo:  `doc|setmargins . . 3 .` -> vai setar margin-bottom para 3cm)

**doc|subscript** -> Habilita/desabilita subscrito na fonte atual

**doc|superscript** -> Habilita/desabilita sobrescrito na fonte atual

**doc|underline** -> Habilita/desabilita sublinhado na fonte atual

<hr>

# <div id="auto-hospedando-o-docwriter">Auto-hospedando o DocWriter</div>

**No momento DocWriter não está disponível publicamente, porém você pode clonar esse repositório e hospedar seu próprio DocWriter na sua máquina! Você pode fazer isto seguindo esses passos:**

1. Acesse o **[Portal de desenvolvedores do Discord](https://discord.com/developers/applications)** e logue com sua conta
2. Inicie uma nova aplicação e dê a ela um nome bacana, como: "DocWriter_Jr"
3. Vá para a seção "Bot" e adicione um novo bot para sua aplicação
4. Clone esse repositório na sua máquina, preferencialmente em uma pasta vazia para melhor organização
5. Volte para a seção "Bot" em sua aplicação e gere um novo token
6. Crie um arquivo ".env" na raíz do repositório e adicione dentro dele:  `BOT_TOKEN="<token_gerado>"`
7. Agora, convide seu bot para seu servidor indo para a seção "OAuth2" e depois "URL Generator", selecione o escopo "bot" e inclua as seguintes permissões:
    * Read Messages/View Channels
    * Send Messages
    * Manage Messages
    * Attach Files
    * Read Message History
8. Abra a URL gerada em seu navegador e convide seu "DocWriter_Jr" para seu servidor
9. Tenha certeza de ter o [Node.Js](https://nodejs.org/en/) instalado em sua máquina (você pode ver qual versão está instalado rodando `node --version` no seu terminal, no caso de nenhuma versão aparecer você deve instalá-lo)
10. Abra um terminal dentro do diretório do repositório e rode `npm start`
11. Aproveite seu próprio DocWriter agora funcional no seu servidor! :tada: 

<hr>

# Licença

* **Esse projeto trabalha sob a [MIT License](LICENSE)**

* **Todas as fontes usadas pelo DocWriter estão disponíveis em: [Google Fonts](https://fonts.google.com)**
