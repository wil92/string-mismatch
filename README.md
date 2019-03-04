# string-mismatch

This library share functions for compare two strings and see the differences.

[![codecov.io](https://img.shields.io/codecov/c/github/wil92/string-mismatch/dev.svg?style=flat-square)](http://codecov.io/github/wil92/string-mismatch?branch=dev)

## Install

```
npm install --save string-mismatch
```

## Getting started

### Web application example

Import the library

```html5
<script src="lib/string-mismatch.js" type="application/javascript"></script>
<!--Minified version-->
<script src="lib/string-mismatch.min.js" type="application/javascript"></script>
```

Use the library

```html5
<script type="application/javascript">
    var start = 'This is a test for see how work the library';
    var end = 'This is a test for know how work the new library';
    var diffs = sm.diff(start, end, 5);
    console.log(diffs);
</script>
```

### Nodejs application example
How to use the library and see the differences between two strings:

```es5
var sm = require('string-mismatch');

var start = 'This is a test for see how work the library',
    end   = 'This is a test for know how work the new library';

console.log(sm.diff(start, end, 5));
/*
result:
[
  {
    mtc: 'This is a test for ',
    del: 'see',
    ins: 'know',
    sbs: ' how work the '
  }, {
    mtc: '',
    del: '',
    ins: 'new ',
    sbs: 'library'
  }
]
*/
```

The result is an object array with the mismatch result. Each object with the next structure:

```es5
{
  mtc: string, // Start of the sub-string
  del: string, // Deleted sub-string from the start string
  ins: string, // New sub-string added in the end string
  sbs: string  // End of the sub-string
}
```

The resulting string can be concatenated like the next example:

```es5
var sm = require('string-mismatch');

var start = 'This is a test for see how work the library',
    end   = 'This is a test for know how work the new library';

console.log(sm.diff(start, end, 5).reduce(function (text, value) {
    return text + value.mtc + (value.del ? '(-' + value.del +')' : '') + (value.ins ? '(+' + value.ins + ')' : '') + value.sbs;
}, ''));
/*
result:
This is a test for (-see)(+know) how work the (+new )library
*/
```

This code can be see in the project examples. To run the examples use the next command:

```
npm start
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

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Guillermo González** - *Initial work* - [wil92](https://github.com/wil92)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://gitlab.com/wil92/wankar-server/blob/development/LICENSE) file for details
