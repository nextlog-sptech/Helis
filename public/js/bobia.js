async function perguntarBobIA(pergunta) {
    const resposta = await fetch('/bobia/perguntar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pergunta: pergunta })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao consultar o BobIA.');
    }

    return dados.resultado;
}

window.perguntarBobIA = perguntarBobIA;

const formularioBobIA = document.getElementById('form-bobia');
const inputBobIA = document.getElementById('input-bobia');
const respostaBobIA = document.getElementById('resposta-bobia');

if (formularioBobIA && inputBobIA && respostaBobIA) {
    formularioBobIA.addEventListener('submit', async function (event) {
        event.preventDefault();

        const pergunta = inputBobIA.value.trim();
        if (!pergunta) {
            respostaBobIA.textContent = 'Digite uma pergunta antes de enviar.';
            return;
        }

        respostaBobIA.textContent = 'Pensando...';

        try {
            const resultado = await perguntarBobIA(pergunta);
            respostaBobIA.textContent = resultado;
        } catch (erro) {
            respostaBobIA.textContent = erro.message || 'Não foi possível consultar o BobIA.';
        }
    });
}
