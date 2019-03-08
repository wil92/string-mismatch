# string-mismatch

This library share functions for compare two strings and see the differences.

[![codecov.io](https://img.shields.io/codecov/c/github/wil92/string-mismatch/master.svg?style=flat-square)](http://codecov.io/github/wil92/string-mismatch?branch=master)

## Install

```
npm install --save string-mismatch
```

## Getting started

### Nodejs application example

How to use the library and see the differences between two strings:

```es5
var sm = require('string-mismatch');

var start = 'This is a test for see how work the library',
    end   = 'This is a test for know how work the new library';

console.log(sm.diff(start, end, 5));
```

The result is an object array with the mismatch result. Each object with the next structure:

```es5
{
  type: string, // type of sub-string:
                //   'sub' -> substitution
                //   'ins' -> insertion
                //   'del' -> deletion
                //   'eql' -> equal
  value: string // value of the current sub-string
}
```

The resulting string can be concatenated like the next example:

```es5
var sm = require('string-mismatch');

var start = 'This is a test for see how work the library',
    end   = 'This is a test for know how work the new library';

function showResult(diffs) {
    return diffs.reduce(function (text, value) {
        switch (value.type) {
            case 'del':
                return text + '(-' + value.value + ')';
            case 'ins':
                return text + '(+' + value.value + ')';
            case 'sub':
                return text + '(-+' + value.value + ')';
            case 'eql':
                return text + value.value;
        }
    }, '');
}

console.log(showResult(sm.diff(start, end)));
/*
result:
This is a test for (-see)(+know) how work the (+new )library
*/
```

This code can be tested in the project's examples. To run the examples use the next command:

```
npm start
```


### Web application example

Import the library

```html5
<!--String mismatch library with greedy algorithm by default-->
<script src="lib/string-mismatch.min.js" type="application/javascript"></script>
<!--Levenshtein algorithm-->
<script src="lib/levenshtein.min.js" type="application/javascript"></script>
```

Use the library (with greedy algorithm by default)

```html5
<script type="application/javascript">
    var start = 'This is a test for see how work the library';
    var end = 'This is a test for know how work the new library';
    var diffs = sm.diff(start, end);
    console.log(diffs);
</script>
```

Example with the levenshtein algorithm

```html5
<script type="application/javascript">
    var start = 'This is a test for see how work the library';
    var end = 'This is a test for know how work the new library';
    sm.use(levenshtein({ignoreSpaces: true}));
    var diffs = sm.diff(start, end);
    console.log(diffs);
</script>
```

## Testing code

```
npm test
```

## Deployment

**not yet**

## Built With

* [webpack](https://webpack.js.org/) - For build the project
* [npm](https://www.npmjs.com/) - Dependency Management
* [mocha](https://mochajs.org/) - The test frameword used
* [chai](https://mochajs.org/) - BDD / TDD assertion library

## Contributing

All contributions are welcome.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/wil92/string-mismatch/tags).

## Authors

* **Guillermo González** - *Initial work* - [wil92](https://github.com/wil92)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://gitlab.com/wil92/wankar-server/blob/development/LICENSE) file for details
