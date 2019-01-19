module.exports = {
    "extends": "airbnb-base",
    "rules": {

      "no-underscore-dangle": 0,
      "no-console": "off",
      "max-len": ["error", { "code": 120 }],
      "prefer-destructuring": ["error", {"object": false, "array": false}],
      "no-param-reassign": [2, { "props": false }]

    }
};
