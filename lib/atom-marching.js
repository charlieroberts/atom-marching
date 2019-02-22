'use babel'

const Environment = require('./main.js')
import { CompositeDisposable } from 'atom'

export default {
  isActive: false,
  subscriptions: null,

  activate(state) {

    // // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-marching:evalLine': () => Environment.evalLine(),
      'atom-marching:evalBlock': () => Environment.evalBlock(),
      'atom-marching:clear': () => Environment.clear()      
    }));

    Environment.start()
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  serialize() {
    return {
    //  atomHydraViewState: this.atomHydraView.serialize()
    };
  }

};
