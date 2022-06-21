import { valida } from './validacao'

const inputs = document.querySelectorAll('input')

inputs.forEach(inputs => {
    inputs.addEventListener('blur', (evento) => {
        valida(evento.target)
    })
})