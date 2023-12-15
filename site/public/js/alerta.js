var alertas = [];

function obterdados(idCamara) {
    fetch(`/medidas/tempo-real/${idCamara}`)
        .then(resposta => {
            if (resposta.status == 200) {
                resposta.json().then(resposta => {

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    alertar(resposta, idCamara);
                });
            } else {
                console.error(`Nenhum dado encontrado para o id ${idCamara} ou erro na API`);
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados do aquario p/ gráfico: ${error.message}`);
        });

}

function alertar(resposta, idCamara) {
    var temp = resposta[0].temperatura;

    var grauDeAviso = '';

    var limites = {
        muito_quente: 23,
        quente: 22,
        ideal: 20,
        frio: 10,
        muito_frio: 5
    };

    var classe_temperatura = 'cor-alerta';

    if (temp >= limites.muito_quente) {
        classe_temperatura = 'cor-alerta perigo-quente';
        grauDeAviso = 'perigo quente'
        grauDeAvisoCor = 'cor-alerta perigo-quente'
        exibirAlerta(temp, idCamara, grauDeAviso, grauDeAvisoCor)
    }
    else if (temp < limites.muito_quente && temp >= limites.quente) {
        classe_temperatura = 'cor-alerta alerta-quente';
        grauDeAviso = 'alerta quente'
        grauDeAvisoCor = 'cor-alerta alerta-quente'
        exibirAlerta(temp, idCamara, grauDeAviso, grauDeAvisoCor)
    }
    else if (temp < limites.quente && temp > limites.frio) {
        classe_temperatura = 'cor-alerta ideal';
        removerAlerta(idCamara);
    }
    else if (temp <= limites.frio && temp > limites.muito_frio) {
        classe_temperatura = 'cor-alerta alerta-frio';
        grauDeAviso = 'alerta frio'
        grauDeAvisoCor = 'cor-alerta alerta-frio'
        exibirAlerta(temp, idCamara, grauDeAviso, grauDeAvisoCor)
    }
    else if (temp <= limites.muito_frio) {
        classe_temperatura = 'cor-alerta perigo-frio';
        grauDeAviso = 'perigo frio'
        grauDeAvisoCor = 'cor-alerta perigo-frio'
        exibirAlerta(temp, idCamara, grauDeAviso, grauDeAvisoCor)
    }

    var card;

    if (document.getElementById(`temp_aquario_${idCamara}`) != null) {
        document.getElementById(`temp_aquario_${idCamara}`).innerHTML = temp + "°C";
    }

    if (document.getElementById(`card_${idCamara}`)) {
        card = document.getElementById(`card_${idCamara}`)
        card.className = classe_temperatura;
    }
}

function exibirAlerta(temp, idCamara, grauDeAviso, grauDeAvisoCor) {
    var indice = alertas.findIndex(item => item.idCamara == idCamara);

    if (indice >= 0) {
        alertas[indice] = { idCamara, temp, grauDeAviso, grauDeAvisoCor }
    } else {
        alertas.push({ idCamara, temp, grauDeAviso, grauDeAvisoCor });
    }

    exibirCards();
}

function removerAlerta(idCamara) {
    alertas = alertas.filter(item => item.idCamara != idCamara);
    exibirCards();
}

function exibirCards() {
    alerta.innerHTML = '';

    for (var i = 0; i < alertas.length; i++) {
        var mensagem = alertas[i];
        alerta.innerHTML += transformarEmDiv(mensagem);
    }
}

function transformarEmDiv({ idCamara, temp, grauDeAviso, grauDeAvisoCor }) {

    var descricao = JSON.parse(sessionStorage.CAMARAS).find(item => item.id == idCamara).descricao;
    return `
    <div class="mensagem-alarme">
        <div class="informacao">
            <div class="${grauDeAvisoCor}">&#12644;</div> 
            <h3>${descricao} está em estado de ${grauDeAviso}!</h3>
            <small>Temperatura ${temp}.</small>   
        </div>
        <div class="alarme-sino"></div>
    </div>
    `;
}

function atualizacaoPeriodica() {
    JSON.parse(sessionStorage.CAMARAS).forEach(item => {
        obterdados(item.id)
    });
    setTimeout(atualizacaoPeriodica, 5000);
}
