// The MIT License (MIT)

// Typed.js | Copyright (c) 2014 Matt Boldt | www.mattboldt.com

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

class Typed {
  constructor(el, options) {
    // chosen element to manipulate text
    this.el = el instanceof Element ? el : document.querySelector(el);

    // options
    this.options = Object.assign({}, Typed.defaults, options);

    // text content of element
    this.baseText =
      this.el.textContent || this.el.getAttribute("placeholder") || "";

    // typing speed
    this.typeSpeed = this.options.typeSpeed;

    // add a delay before typing starts
    this.startDelay = this.options.startDelay;

    // backspacing speed
    this.backSpeed = this.options.backSpeed;

    // amount of time to wait before backspacing
    this.backDelay = this.options.backDelay;

    // input strings of text
    this.strings = this.options.strings;

    // character number position of current string
    this.strPos = 0;

    // current array position
    this.arrayPos = 0;

    // number to stop backspacing on.
    // default 0, can change depending on how many chars
    // you want to remove at the time
    this.stopNum = 0;

    // Looping logic
    this.loop = this.options.loop;
    this.loopCount = this.options.loopCount;
    this.curLoop = 0;

    // for stopping
    this.stop = false;

    // show cursor
    this.showCursor = this.isInput ? false : this.options.showCursor;

    // custom cursor
    this.cursorChar = this.options.cursorChar;

    // attribute to type
    this.isInput = this.el.tagName.toLowerCase() === "input";
    this.attr = this.options.attr || (this.isInput ? "placeholder" : null);

    // All systems go!
    this.build();
  }

  init() {
    // begin the loop w/ the first current string (global self.string)
    // the current string will be passed as an argument each time after this
    const self = this;
    self.timeout = setTimeout(() => {
      // Start typing
      self.typewrite(self.strings[self.arrayPos], self.strPos);
    }, self.startDelay);
  }

  build() {
    // Insert cursor
    if (this.showCursor === true) {
      this.cursor = document.createElement("span");
      this.cursor.className = "typed-cursor";
      this.cursor.textContent = this.cursorChar;
      this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
    }
    this.init();
  }

  typewrite(curString, curStrPos) {
    // exit when stopped
    if (this.stop === true) return;

    // varying values for setTimeout during typing
    // can't be global since the number changes each time the loop is executed
    const humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
    const self = this;

    // contain typing function in a timeout humanize'd delay
    self.timeout = setTimeout(() => {
      // check for an escape character before a pause value
      // format: \^\d+ .. e.g., ^1000 .. should be able to print the ^ too using ^^
      // single ^ are removed from the string
      let charPause = 0;
      let substr = curString.substr(curStrPos);
      if (substr.charAt(0) === "^") {
        let skip = 1; // skip at least 1
        if (/^\^\d+/.test(substr)) {
          substr = /\d+/.exec(substr)[0];
          skip += substr.length;
          charPause = parseInt(substr);
        }

        // strip out the escape character and pause value so they're not printed
        curString =
          curString.substring(0, curStrPos) +
          curString.substring(curStrPos + skip);
      }

      // timeout for any pause after a character
      self.timeout = setTimeout(() => {
        if (curStrPos === curString.length) {
          // fires callback function
          self.options.onStringTyped(self.arrayPos);

          // is this the final string
          if (self.arrayPos === self.strings.length - 1) {
            // animation that occurs on the last typed string
            self.options.callback();

            self.curLoop++;

            // quit if we won't loop back
            if (self.loop === false || self.curLoop === self.loopCount) return;
          }

          self.timeout = setTimeout(() => {
            self.backspace(curString, curStrPos);
          }, self.backDelay);
        } else {
          /* call before functions if applicable */
          if (curStrPos === 0) self.options.preStringTyped(self.arrayPos);

          // start typing each new char into the existing string
          // curString: arg, self.baseText: original text inside element
          const nextString = self.baseText + curString.substr(0, curStrPos + 1);
          if (self.attr) {
            self.el.setAttribute(self.attr, nextString);
          } else {
            self.el.textContent = nextString;
          }

          // add characters one by one
          curStrPos++;
          // loop the function
          self.typewrite(curString, curStrPos);
        }
        // end of character pause
      }, charPause);
      // humanized value for typing
    }, humanize);
  }

  backspace(curString, curStrPos) {
    // exit when stopped
    if (this.stop === true) return;

    // varying values for setTimeout during typing
    // can't be global since the number changes each time the loop is executed
    const humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
    const self = this;

    self.timeout = setTimeout(() => {
      // replace text with base text + typed characters
      const nextString = self.baseText + curString.substr(0, curStrPos);
      if (self.attr) {
        self.el.setAttribute(self.attr, nextString);
      } else {
        self.el.textContent = nextString;
      }

      // if the number (id of character in the current string) is
      // less than the stop number, keep going
      if (curStrPos > self.stopNum) {
        // subtract characters one by one
        curStrPos--;
        // loop the function
        self.backspace(curString, curStrPos);
      }
      // if the stop number has been reached, increase
      // array position to the next string
      else if (curStrPos <= self.stopNum) {
        self.arrayPos++;

        if (self.arrayPos === self.strings.length) {
          self.arrayPos = 0;
          self.init();
        } else self.typewrite(self.strings[self.arrayPos], curStrPos);
      }
      // humanized value for typing
    }, humanize);
  }

  reset() {
    const self = this;
    clearInterval(self.timeout);
    const id = this.el.id;
    this.el.parentNode.insertAdjacentHTML("afterend", `<span id="${id}"/>`);
    this.el.remove();
    this.cursor.remove();
    // Send the callback
    self.options.resetCallback();
  }
}

Typed.defaults = {
  strings: [
    "These are the default values...",
    "You know what you should do?",
    "Use your own!",
    "Have a great day!",
  ],
  // typing speed
  typeSpeed: 0,
  // time before typing starts
  startDelay: 0,
  // backspacing speed
  backSpeed: 0,
  // time before backspacing
  backDelay: 1500,
  // loop
  loop: true,
  // false = infinite
  loopCount: false,
  // show cursor
  showCursor: true,
  // character for cursor
  cursorChar: "|",
  // attribute to type (null == text)
  attr: null,
  // call when done callback function
  callback: function () {},
  // starting callback function before each string
  preStringTyped: function () {},
  // callback for every typed string
  onStringTyped: function () {},
  // callback for reset
  resetCallback: function () {},
};
