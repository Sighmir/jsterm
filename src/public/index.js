/*
jsterm - A terminal emulator made with Node.js and xterm.js.
Copyright (C) 2019  Guilherme Caulada (Sighmir)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const socket = io.connect('http://localhost:' + port)

const fitAddon = new FitAddon.FitAddon()
const term = new Terminal({
  rightClickSelectsWord: false,
  cursorBlink: true,
  scrollback: 5000,
  tabStopWidth: 4
})

term.loadAddon(fitAddon)

term.open(document.getElementById('terminal'))

term.onData((data) => {
  socket.emit('write', data)
})

socket.on('write', (data) => {
  term.write(data, () => console.log(data))
})

socket.emit('spawn', shell)

term.onResize((size) => {
  socket.emit('resize', size)
})

fitAddon.fit()
socket.emit('resize', { cols: term.cols, rows: term.rows })

window.addEventListener('resize', (data) => {
  setTimeout(() => {
    fitAddon.fit()
  }, 250)
})