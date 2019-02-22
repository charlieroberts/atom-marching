'use babel'

var MessagePanelView = require('atom-message-panel').MessagePanelView
var PlainMessageView = require('atom-message-panel').PlainMessageView

// I guess this automagickally sticks it in a global?
require('marching')

Math.export = ()=> {
  const arr = Object.getOwnPropertyNames( Math )
  arr.forEach( el => window[el] = Math[el] )
}

const ease = t => t < .5 ? 2*t*t : -1+(4-2*t)*t

export default {
  _eval(code) {
    var success = true
    try {
      eval(code)
    } catch (e) {
      success = false
      console.log(e, e.name, e.lineNumber, e.columnNumber, e.stack)
      // this.messages.add(new PlainMessageView({
      //     message: e.message,
      //     className: 'text-error'
      // }))
      this.log(e.message, 'text-error')
    }
    if(success) {
      this.log(code, 'text-muted')
      // this.messages.add(new PlainMessageView({
      //     message: code,
      //     className: 'text-muted'
      // }))
    }
  },

  log(msg, _class) {
    this.messages.clear()
    this.messages.add(new PlainMessageView({
        message: msg,
        className: _class
    }))
  },

  evalBlock() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      const range = this.getCurrentParagraphIncludingComments(editor);
      this.evalFlash(range)
      const expression = editor.getTextInBufferRange(range);
      this._eval(expression)
    }

  },

  getCurrentParagraphIncludingComments(editor) {
      const cursor = editor.getLastCursor()
      let startRow = endRow = cursor.getBufferRow()
      let lineCount = editor.getLineCount()

      // lines must include non-whitespace characters
      // and not be outside editor bounds
      while (/\S/.test(editor.lineTextForBufferRow(startRow)) && startRow >= 0) startRow--
      while (/\S/.test(editor.lineTextForBufferRow(endRow)) && endRow < lineCount) endRow++

      return {
          start: {
              row: startRow + 1,
              column: 0
          },
          end: {
              row: endRow,
              column: 0
          },
      };
  },

  evalFlash(range) {
    const editor = atom.workspace.getActiveTextEditor()
    if( editor ) {
      const marker = editor.markBufferRange(
        range,
        { invalidate: 'touch' }
      )

      const decoration = editor.decorateMarker(
        marker,
        { type: 'line', class: 'marching-flash' }
      )

      setTimeout(() => {
        marker.destroy();
      }, 200)
    }
  },

  evalLine () {
    let editor

    if( editor = atom.workspace.getActiveTextEditor() ) {
      let range
      let selection = editor.getSelectedText()
      range = editor.getSelectedBufferRange()

      if( selection.length < 1 ){
        const pt = editor.getCursorBufferPosition()
        selection = editor.lineTextForBufferRow(pt.row)
        range = { start: pt, end: pt }
      }

      this._eval(selection)
      this.evalFlash(range)
    }
  },

  start() {
    console.log( 'Starting...' )

    this.messages = new MessagePanelView({ title: 'marching >>'})
    this.messages.attach()
    this.messages.toggle()

    atom.workspace.element.oncontextmenu = function(event) {
      if(event.preventDefault != undefined) event.preventDefault()
      if(event.stopPropagation != undefined) event.stopPropagation()
    }

    const editor = atom.workspace.getActiveTextEditor()
    this.element = document.createElement('div')
    this.element.classList.add('marching')
    this.canvas = document.createElement('canvas')
    this.canvas.width = 1280
    this.canvas.height = 720

    document.body.classList.add('marching-enabled')
    this.element.appendChild(this.canvas)
    atom.workspace.element.appendChild(this.element)

    Marching.init( this.canvas )
    Marching.export( window )
    window.fade = this.fade
    Math.export()
  },

  clear() {
    Marching.clear()
    onframe = ()=> {}
    //proxies.length = 0
  },

  fade( objname, propname, target, seconds ) {
    const split = propname.indexOf('.') === -1 ? null : propname.split('.')
    const startValue = [], diff = []
    const inc  = 1 / ( seconds * 60 )
    const isVec = split === null && window[ objname ][ propname ].type.indexOf( 'vec' ) !== -1

    let vecCount = isVec === true ? parseInt( window[ objname ][ propname ].type.slice(3) ) : null
    let t = 0

    if( isVec ) {
      startValue[0] = window[ objname ][ propname ].x
      startValue[1] = window[ objname ][ propname ].y
      if( vecCount > 2 ) startValue[2] = window[ objname ][ propname ].z

      diff[0] = target - startValue[0]
      diff[1] = target - startValue[1]
      if( vecCount > 2 ) diff[2] = target - startValue[2]
    }else{
      startValue[ 0 ] = split === null
        ? window[ objname ][ propname ].value
        : window[ objname ][ split[0] ][ split[1] ]

      diff[ 0 ] = target - startValue
    }

    const fnc = () => {
      const easeValue = ease( t )
      if( split === null ) {
        if( isVec === false ) {
          window[ objname ][ propname ] = startValue[0] + easeValue * diff[0]
        }else{
          window[ objname ][ propname ].x = startValue[0] + easeValue * diff[0]
          window[ objname ][ propname ].y = startValue[1] + easeValue * diff[1]

          if( vecCount > 2 ) {
            window[ objname ][ propname ].z = startValue[2] + easeValue * diff[2]
          }
        }
      }else{
        window[ objname ][ split[0] ][ split[1] ] = startValue[0] + easeValue * diff[0]
      }

      t += inc
      if( t >= 1 ) {
        if( split !== null ) {
          window[ objname ][ split[0] ][ split[1] ] = target
        }else{
          window[ objname ][ propname ] = target
        }

        fnc.cancel()
      }
    }

    callbacks.push( fnc )

    fnc.cancel = ()=> {
      const idx = callbacks.indexOf( fnc )
      callbacks.splice( idx, 1 )
    }

    return fnc
  }
}
