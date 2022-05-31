![DocWriter](readmeFiles/document-3503099_960_720.png)

<center>
<br>

<b style="font-family: monospace;font-size: 30pt">DocWriter
</b>

### DocWriter é o seu bot do Discord para ajudar a escrever documentos sem precisar sair do aplicativo

</center>
<br><hr><br>

# **Como funciona?**

### Para usar o DocWriter basta seguir esses simples passos:

<ol>

### <li>Convide DocWriter para o seu servidor (No momento indisponível, mais informações em: [Auto-Hospedando o DocWriter](#Auto-Hospedando-o-DocWriter))</li>

### <li>Escreva uma mensagem que queira adicionar em seu documento</li>

### <li>Use o comando `doc|addcontent` para incluir o texto no documento</li>

### <li>Finalize o documento e gere um arquivo PDF usando o comando `doc|exportpdf <nome_do_arquivo>`</li></ol>

<center> 

![demonstration](readmeFiles/demonstration.gif)
</center>

<br><hr><br>

# **Comandos**

### DocWriter tem dois tipos de comandos: Comandos de utilidade e Comandos de formatação:
<br>

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

<br><hr><br>

# **Auto-hospedando o DocWriter**

### No momento DocWriter não está disponível publicamente, porém você pode clonar esse repositório e hospedar seu próprio DocWriter na sua máquina!

### Você pode fazer isto seguindo esses passos:

<ol>

### <li>Acesse o [Portal de desenvolvedores do Discord](https://discord.com/developers/applications) e logue com sua conta</li>

### <li>Inicie uma nova aplicação e dê a ela um nome bacana, como: "DocWriter_Jr"</li>

### <li>Vá para a seção "Bot" e adicione um novo bot para sua aplicação</li>

### <li>Clone esse repositório na sua máquina, preferencialmente em uma pasta vazia para melhor organização</li>

### <li>Volte para a seção "Bot" em sua aplicação e gere um novo token</li>

### <li>Crie um arquivo ".env" na raíz do repositório e adicione dentro dele:  `BOT_TOKEN="<token_gerado>"`</li>

### <li>Agora, convide seu bot para seu servidor indo para a seção "OAuth2" e depois "URL Generator", selecione o escopo "bot" e inclua as seguintes permissões:
<ul>
    <li>Read Messages/View Channels</li>
    <li>Send Messages</li>
    <li>Manage Messages</li>
    <li>Attach Files</li>
    <li>Read Message History</li>
</ul>

### Abra a URL gerada em seu navegador e convide seu "DocWriter_Jr" para seu servidor</li>

### <li>Tenha certeza de ter o [Node.Js](https://nodejs.org/en/) instalado em sua máquina (você pode ver qual versão está instalado rodando `node --version` no seu terminal, no caso de nenhuma versão aparecer você deve instalá-lo)</li>

### <li>Abra um terminal dentro do diretório do repositório e rode `npm start`</li>

### <li>Aproveite seu próprio DocWriter agora funcional no seu servidor! :tada: </li>

<br><hr><br>

# **Licença**

<ul>

### <li>Esse projeto trabalha sob a [MIT License](LICENSE)</li>

### <li>Todas as fontes usadas pelo DocWriter estão disponíveis em: [Google Fonts](https://fonts.google.com)