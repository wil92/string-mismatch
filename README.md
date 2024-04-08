# string-mismatch library

[![Build Status](https://travis-ci.org/wil92/string-mismatch.png?branch=master)](https://travis-ci.org/wil92/string-mismatch)
[![codecov.io](https://img.shields.io/codecov/c/github/wil92/string-mismatch/master.svg?style=flat-square)](http://codecov.io/github/wil92/string-mismatch?branch=master)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/wil92/string-mismatch/issues)

The library contain the next string comparison algorithms:

|                                       |Greedy                         |[Levenshtein](https://en.wikipedia.org/wiki/Levenshtein_distance)|[Dice Coefficient](https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient)|
|---------------------------------------|-------------------------------|-----------------------------------------------------------------|----------------------------------------------------------------------------------------|
|**Complexity**                         |O(n*k) (**k** precision)       |O(n^2)                                                           |O(nlog n)                                                                               |
|**Good**                               |Fast algorithm                 |Always the optimal solution                                      |Is based in probabilities and is a really fast algorithm                                |
|**Bad**                                |The solution is not the optimal|Complexity is O(n^2)                                             |Impossible to see the differences between the strings                                   |
|                                       |                               |Use n^2 memory                                                   |                                                                                        |
|**Methods**                            |*difference*                   |*difference*                                                     |*distance*                                                                              |
|                                       |*distance*                     |*distance*                                                       |                                                                                        |
|**Operations for transform the string**|*insertion*                    |*insertion*                                                      |*not apply*                                                                             |
|                                       |*deletion*                     |*deletion*                                                       |                                                                                        |
|                                       |                               |*substitution*                                                   |                                                                                        |
|**Class name**                         |`Greedy`                       |`Levenshtein`                                                    |`DiceCoefficient`                                                                                      |

Why use string-mismatch:

- Ease to install and start using it
- Modular library (use only what you want to use).
- Support for browser and node applications.
- Compatible with es5
- Not external dependencies.
- Completely documented.
- Coverage over 95%.

## Install

```
npm install --save string-mismatch
```

## Getting started

### Nodejs application example

How to use the library and see the differences between two strings:

```es5
const sm = require("string-mismatch");
const greedyInstance = new sm.Greedy();

var start = 'This is a test for see how work the library',
    end   = 'This is a test for know how work the new library';

console.log(greedyInstance.differences(start, end));
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
const sm = require("string-mismatch");
const greedyInstance = new sm.Greedy();

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

console.log(showResult(greedyInstance.differences(start, end)));
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
<!--Greedy algorithm-->
<script src="lib/greedy.min.js" type="application/javascript"></script>
<!--Levenshtein algorithm-->
<script src="lib/levenshtein.min.js" type="application/javascript"></script>
```

Example with greedy algorithm:

```html5
<script type="application/javascript">
    var start = 'This is a test for see how work the library';
    var end = 'This is a test for know how work the new library';
    var alg = new Greedy(options);
    var diffs = alg.differences(start, end);
    console.log(diffs);
</script>
```

Example with the levenshtein algorithm:

```html5
<script type="application/javascript">
    var start = 'This is a test for see how work the library';
    var end = 'This is a test for know how work the new library';
    var alg = new Levenshtein(options);
    var diffs = alg.differences(start, end);
    console.log(diffs);
</script>
```

## Testing code

```
npm test
```

## Built With

* [webpack](https://webpack.js.org/) - For build the project
* [npm](https://www.npmjs.com/) - Dependency Management
* [jest](https://jestjs.io/) - Jest framework for test

## Contributing

All contributions are welcome.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/wil92/string-mismatch/tags).

## Authors

* **Guillermo González** - *Initial work* - [wil92](https://github.com/wil92)

## [CHANGELOG](./CHANGELOG.md)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://gitlab.com/wil92/wankar-server/blob/development/LICENSE) file for details
