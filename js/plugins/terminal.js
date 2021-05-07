const RevealTerminal = {
    id: 'terminal',
    init: (deck) => {
        const terminalSlides = document.querySelectorAll('.reveal .slides section.terminal');

        for (let terminalSlideSection of terminalSlides){
            const terminal = document.createElement('iframe');
            terminal.classList.add('terminal');
            terminal.setAttribute('data-src', './code/index.html');

            terminalSlideSection.insertAdjacentElement('afterbegin', terminal);
        }
    }
}

export default RevealTerminal;