
export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    if (validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    }
    if (input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHtml = ''
    } else {
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHtml = mostraMensagemDeErro(tipoInput, input)
    }

}

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const mensagemDeErro = {
    nome: {
        valueMissing: 'O campo nome não pode esta vazio.'
    },
    email: {
        valueMissing: 'O campo email não pode esta vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha: {
        valueMissing: 'O campo de senha não pode estar vazio.',
        patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.'
    },
    dataNascimento: {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior de 18 anos para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CPF digitado não é valido.'
    },
    cep: {
        valueMissing: 'O campo de CEP não pode esta vazio.',
        patternMismatch: 'O CEP digitado não é valido.',
        customError: 'Não foi possível buscar o CEP.'
    },
    logradouro: {
        valueMissing: 'O campo de logradouro não pode estar vazio.'
    },
    cidade: {
        valueMissing: 'O campo de cidade não pode estar vazio.'
    },
    estado: {
        valueMissing: 'O campo de estado não pode estar vazio.'
    },
    preco: {
        valueMissing: 'O campo de preço não pode estar vazio.'
    }



}

const validadores = {
    dataNascimento: input => validaDataNascimento(input),
    cpf: input => validaCpf(input),
    cep: input => recuperarCEP(input)
}

//const dataNascimento = document.querySelector('#nascimento')

//Quando perde o foco usar o evendo blur
dataNascimento.addEventListener('blur', (evento) => {
    validaDataNascimento(evento.target)
})

function mostraMensagemDeErro(tipoInput, input) {
    let mensagem = ''

    tiposDeErro.forEach(erro => {
        if (input.validity[erro]) {
            mensagem = mensagemDeErro[tiposDeErro][erro]
        }
    })

    return mensagem;
}

function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value)
    let mensagem = ''

    if (!maiorQue18(dataRecebida)) {
        mensagem = 'Você deve ser maior de 18 anos para se cadastrar.'

    }

    input.setCustomValidity(mensagem)
}

function maiorQue18(data) {
    const dataAtual = new Date();
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

    return dataMais18 <= dataAtual;
}

function validaCpf(input) {
    const cpfFormatado = input.value.replace(/\D/g, '')

    let mensagem = ''

    //se a função retorna falso ele cai na condição
    if (!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
        mensagem = 'O CPF digitado não é valido.'
    }


    input.setCustomValidity(mensagem)
}

function checaCPFRepetido(cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]

    let cpfValido = true

    valoresRepetidos.forEach(valor => {
        if (valor == cpf) {
            cpfValido = false
        }
    })

    return cpfValido
}

function checaEstruturaCPF(cpf) {
    return checaDigitadoVerificador(cpf, multiplicador)
}

function checaDigitadoVerificador(cpf, multiplicador) {
    if (multiplicador >= 12) {
        return true
    }

    let multiplicadorInicial = multiplicador
    let soma = 0
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)

    for (let contato = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
        contador++
    }

    if (digitoVerificador === confirmaDigito(soma)) {
        return checaDigitadoVerificador(cpf, multiplicador + 1)
    }

    return false
}

function confirmaDigito(soma) {
    return 11 - (soma % 11)
}

function recuperarCEP(input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    }

    if (!input.validity.patternMismatch && !input.validity.value) {
        fetch(url, options).then(
            response => response.json()
        ).then(
            data => {
                if (data.erro) {
                    input.setCustomValidity('Não foi possível buscar o CEP')
                    return
                }
                input.setCustomValidity('')
                preencherCamposComCEP(data)
                return
            }
        )
    }
}

function preencherCamposComCEP(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}
