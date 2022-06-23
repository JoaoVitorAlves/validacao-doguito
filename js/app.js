import { valida } from './validacao'

const inputs = document.querySelectorAll('input')

inputs.forEach(inputs => {
    if (inputs.dataset.tipo === 'preco') {
        SimpleMaskMoney.setMask(input, {
            prefix: 'R$ ',
            fixed: true,
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end'
        })
    }

    inputs.addEventListener('blur', (evento) => {
        valida(evento.target)
    })
})