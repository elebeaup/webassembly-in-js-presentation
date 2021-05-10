import historyHandler from './history.js';
import XTerm from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const ESC = '\x1B';

class FakeTerminal {
  constructor(option = {}) {
    this._option = {
      prompt: '> ',
      ...option,
    };

    this._history = historyHandler();
    this._input = '';

    this.fitAddon = new FitAddon();
    this._term = new XTerm.Terminal({
      fontSize: 25,
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: 'C64 Pro',
      theme: {
        background: '#4040E0',
        cursor: '#A0A0FF',
        foreground: '#A0A0FF',
      },
    });
    this._term.loadAddon(this.fitAddon);
    this._term.open(document.querySelector('#terminal'));

    window.addEventListener('resize', (e) => {
      this.fitAddon.fit();
    });

    this._term.attachCustomKeyEventHandler(this._attachCustomKeyEventHandler.bind(this));
    this._term.onSelectionChange(this._onSelectionChange.bind(this));
    this._term.onData(this._handleData.bind(this));

    this.onInputEntered = (data) => Promise.resolve(data);

    this.fitAddon.fit();
    this.printTextInCenter('**** WELCOME TO WASM LAND ****', 2);
    this.print('READY.', 4);
    this._printPrompt();
  }

  print(str, row = this._term._core.buffer.y + 1, column = 1) {
    this._term.writeln(`${ESC}[${row};${column}H${str}`);
  }

  printTextInCenter(str, row = this._term._core.buffer.y) {
    const numberColumns = this._term.cols;

    this.print(str, row, Math.round((numberColumns - str.length) / 2));
  }

  registerCompleteHandler(completeHandler) {
    this._completeHandler = completeHandler;
  }

  _printPrompt() {
    const { prompt } = this._option;
    this._term.write(`\r${prompt}`);
  }

  _attachCustomKeyEventHandler(event) {
    const { _term: term } = this;

    if (event.ctrlKey && event.code === 'KeyL') {
      term.write(`${ESC}c`); // Clear Screen
      this._printPrompt(term);
      this._input = '';
    }
  }

  _onSelectionChange() {
    const { _term: term } = this;

    if (term.hasSelection()) {
      document.execCommand('copy');
    }
  }

  _handleData(data) {
    const { _term: term, _history: history } = this;
    const { prompt } = this._option;

    const cursor = this._term._core.buffer.x - prompt.length;

    switch (data) {
      case '\r': // Enter
        if (this.onInputEntered && this._input.length > 0) {
          history.push(this._input);
          this.onInputEntered(this._input)
            .then((result) => {
              term.writeln(`\r\n${ESC}[3m${result}${ESC}[0m`);
            })
            .catch((e) => {
              term.writeln(`\r\n${ESC}[31m${e}${ESC}[39m`);
            })
            .finally(() => {
              this._printPrompt();
              this._input = '';
            });
        }
        break;
      case '\t':
        if (this._completeHandler && this._input.length > 0) {
          const inputToCursor = this._input.substr(0, cursor);
          const candidate = this._completeHandler(inputToCursor);

          if (candidate.length > 0) {
            term.write(`${ESC}[${candidate.length}@`);
            term.write(candidate);
            this._input = this._input.substr(0, cursor) + candidate + this._input.substr(cursor);
          }
        }
        break;
      case '\u0003': // Ctrl+C
        term.write('\n');
        this._printPrompt();
        this._input = '';
        break;
      case '\u007F': // Backspace
        // Do not delete the prompt
        if (term._core.buffer.x > prompt.length) {
          term.write(`${ESC}[D`);
          term.write(`${ESC}[P`);
          this._input = this._input.substr(0, cursor - 1) + this._input.substr(cursor);
        }
        break;
      case `${ESC}[3~`: // DEL
        term.write(`${ESC}[P`);
        this._input = this._input.substr(0, cursor) + this._input.substr(cursor + 1);
        break;
      case `${ESC}[A`: // Up arrow
        {
          const value = history.previous(this._input);

          if (value) {
            this._input = this._updateCurrentLine(value);
          }
        }
        break;
      case `${ESC}[B`: // Down arrow
        {
          const value = history.next();
          this._input = this._updateCurrentLine(value);
        }
        break;
      case `${ESC}[C`: // Right arrow
        if (cursor < this._input.length) {
          term.write(data);
        }
        break;
      case `${ESC}[D`: // Right arrow
        if (cursor > 0) {
          term.write(data);
        }
        break;
      default:
        if (data.charCodeAt(0) < 32) return;

        this._input = this._input.substr(0, cursor) + data + this._input.substr(cursor);
        term.write(`${ESC}[@`);
        term.write(data);
        break;
    }
  }

  _updateCurrentLine = (input) => {
    this._term.write(`\r${ESC}[K`);
    this._printPrompt();
    this._term.write(input);

    return input;
  };
}

export default FakeTerminal;