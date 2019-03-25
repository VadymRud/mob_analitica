module.exports = {
    extends: "google",
    env: {
      es6: true
    },
    rules: {
      "no-trailing-spaces": 0,
      "max-len": 0,           // allows long lines
      "prefer-const": 0,      // allows "let requestParam = ..." instead of "const requestParam = ..." 
      "brace-style": 0,       // allows single-line blocks: "if (...) {action();}"  
      "padded-blocks": 0,     // allows blank lines within block braces (immediately after/before ones)
      "no-multi-spaces": 0,   // allows multi-space indentation within statements
      "key-spacing": 0,       // allows multi-space indentation within statements also
      "require-jsdoc": 0,     // allows no js-doc comments
      "arrow-parens": 0       // allows one-parameter arrow func definitions wihtout parenthesis
    }
};
