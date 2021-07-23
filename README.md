# JSFuck `[]()!+`

JSFuck is an esoteric and educational programming style based on the atomic parts of JavaScript. It uses only six different characters to write and execute code.

It does not depend on a browser, so you can even run it on Node.js.

Demo: [jsfuck.com](http://www.jsfuck.com)

By [@aemkei](https://twitter.com/aemkei) and [friends](https://github.com/aemkei/jsfuck/graphs/contributors).

### Example

The following source will do an `alert(1)`:

```js
[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[
]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]][([][(![]+[])[+[]]+([![]]+[][[]
])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+
(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+
!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![
]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]
+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[
+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!!
[]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![
]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[
]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((![]+[])[+!+[]]+(![
]+[])[!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+(!
[]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])
[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]]+[+!+[]]+(
!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[
])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]])()
```

### Basics

    false       =>  ![]
    true        =>  !![]
    undefined   =>  [][[]]
    NaN         =>  +[![]]
    0           =>  +[]
    1           =>  +!+[]
    2           =>  !+[]+!+[]
    10          =>  +[[+!+[]]+[+[]]]
    Array       =>  []
    Number      =>  +[]
    String      =>  []+[]
    Boolean     =>  ![]
    Function    =>  []["filter"]
    run         =>  []["filter"]["constructor"]( CODE )()
    eval        =>  []["filter"]["constructor"]("return eval")()( CODE )
    window      =>  []["filter"]["constructor"]("return this")()

See the full list [here](https://github.com/aemkei/jsfuck/blob/master/jsfuck.js).  

# How it Works

**Note:** Feel free to join the discussion here: https://gitter.im/aemkei/jsfuck

## `[]` – Brackets

Let's start with the opening and closing brackets and see what is possible here. They are super useful for this project and are considered as a core element because they provide a way to:

1. deal with arrays
2. access properties and methods.


### `[]` – Array Literals

Create new arrays:

```js
[]   // an empty array
[[]] // an array with one element (another array)
```

### `[X][i]` – Array / Object Access

```js
[][[]] // undefined, same as [][""]
```

Later we will be able to do this:

```js
"abc"[0]     // get single letter
[]["length"] // get property
[]["fill"]   // get methods
```

### `[X][0]` - Array wrapping trick

By wrapping an expression in an array and then getting the element at index zero, we can apply several operators on one expression. This means brackets `[]` can replace parenthesis `()` to isolate expressions:

```js
          [X][0]           // X
++[ ++[ ++[X][0] ][0] ][0] // X + 3
```

## `+` – Plus Sign

This symbol is useful, because it allows us to:

1. create numbers
2. add two values
3. concatenating strings
4. create strings

The current version of JSFuck uses it a lot but we not sure if they are fundamental.

### Cast to Number

```js
+[] // 0 - the number 0
```

### Increment Numbers

Using the array wrapping trick mentioned above:

```js
++[ 0  ][  0  ] // 1
++[ [] ][ +[] ] // 1
```

### Getting `undefined`

Getting an element by index in an empty array will return `undefined`:

```js
[][   0 ] // undefined
[][ +[] ] // get first element (undefined)
[][  [] ] // look for property ""
```

### Getting `NaN`

Casting `undefined` to Number will result in not-a-number:

```js
+[][[]]    // +undefined = NaN
```

### Add Numbers

```js
          1 +           1 // 2
++[[]][+[]] + ++[[]][+[]] // 2
```

A shorter way using ++:

```js
++[          1][  0] // 2
++[++[[]][  0]][  0] // 2
++[++[[]][+[]]][+[]] // 2
```

Using this technique, we are able to access all digits:

`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`

### `+[]` – Casting to String

Combining the plus sign and brackets will turn other values into strings:

```js
  []        +[] // "" - empty string
 +[]        +[] // "0"
  [][[]]    +[] // "undefined"
++[][[]]    +[] // "NaN"
++[[]][+[]] +[] // "1"
```

### `"word"[i]` – Get Single Characters

As we have strings, we can also get single characters:

```js
  "undefined"          [  0] // "u"
[ "undefined"    ][  0][  0] // "u"
[  undefined +[] ][+[]][+[]] // "u"
[  [][[]]    +[] ][+[]][+[]] // "u"
```

```js
  "undefined"   [           1 ] // "n"
[[][[]]+[]][+[]][ ++[[]][+[]] ] // "n"
```

Since we have "NaN" and "undefined", we got the following characters:

`N`,`a`,`d`,`e`,`f`,`i`,`n`,`u`.

## `+` – Combine Characters

Now we can concat characters to new words.

```js
// can be written using []+ only:
"undefined"[4] // "f"
"undefined"[5] // "i"
"undefined"[6] // "n"
"undefined"[3] // "d"

// combine using +
"f"+"i"+"n"+"d" // "find"
```

## `"e"` – Numbers in exponential notation

As we have the character "e" from "undefined", we can use exponential notation to construct very big numbers and get a reference to `Infinity`:

```js
+("1e309")         //  Infinity
+("1e309")     +[] // "Infinity"
+("11e100")        //  1.1e+101
+("11e100")    +[] // "1.1e+101"   (gives us `.` and `+`)
+("0.0000001")     //  1e-7
+("0.0000001") +[] // "1e-7"       (gives us `-`)
```

Resulting chars:

`I`,`f`,`i`,`n`,`t`,`y`,`.`,`+`,`-`.


## `[]["method"]` – Access Methods

Newly combinded characters can form method names. These can be accessed using the square brackets notation:

```js
[]["f"+"i"+"n"+"d"] // where "f" is the first char of "false" and so on
[]["find"]          // same as the dot syntax:
[] .find
```

*Note*: With the characters from "undefined", "NaN" and "Infinity", the only method we are able to find in the objects we have is `Array.prototype.find`.

## `method+[]` – Get Method Definitions

We can cast a method to a String and get its definition as a String:

```js
[]["find"] +[]
```

This will return the following String:

```js
"function find() { [native code] }"
```

*Note*: String representations of native functions are not part of the ECMAScript standard and differ between browsers. For example, Firefox will output a slightly different string with additional line breaks using `\n`.

Resulting characters:

* `a`,`c`,`d`,`e`,`f`,`i`,`n`,`o`,`t`,`u`,`v`
* ` `, `{`, `}`, `(`, `)`, `[`,`]`

Resulting methods:

* `.concat`
* `.find`.

## `!` – Logical NOT operator

This is the fourth character in the original JSFuck set and used to create booleans.

Note: This symbol could also be replaced by others, like `<` or `=`. See the section "Alternatives" below.

### `!X` – Cast to Boolean

The logical "Not" operator can be used to create booleans `false` and `true`:

```js
 ![] // false
!![] // true
```

### `!X+[]` – Get "true" and "false"

Booleans can be casted to string:

```js
 ![] +[] // "false"
!![] +[] // "true"
```

This will give us access to more characters:

`a`, `e`, `f`, `l`, `r`, `s`, `t`, `u`.

Together with the set above, we will have `{}()[]+. INacdefilnorstuvy` with access to these methods:

* `call`
* `concat`
* `constructor`
* `entries`
* `every`
* `fill`
* `filter`
* `find`
* `fontcolor`
* `includes`
* `italics`
* `reduce`
* `reverse`
* `slice`
* `sort`

*Important:* We might use another symbols like `=` to create booleans, because they are more powerful (see section "Alternatives" below).

## `X["constructor"]` – Primitive wrappers names

With `.constructor` we have a reference to the function that created the instance. For primitives values, it returns the corresponding built-in wrappers:

```js
0       ["constructor"] // Number
""      ["constructor"] // String
[]      ["constructor"] // Array
false   ["constructor"] // Boolean
[].find ["constructor"] // Function
```

Use `+[]` to convert them to strings and retrieve their function name in order to get more chars:

```js
0["constructor"]+[] // "function Number() { ... }"
```

New chars available :
`m`, `b`, `S`, `g`, `B`, `A`, `F`.

… and more methods and properties:

* `arguments`
* `big`
* `bind`
* `bold`
* `name`
* `small`
* `some`
* `sub`
* `substr`
* `substring`
* `toString`
* `trim`


## `()` – Parenthesis

### Calling Methods

Since we have access to methods, we can call them to get more power. To do this we need to introduce two more symbols `(` and `)` here.

Example without arguments:

```js
""["fontcolor"]()   // "<font color="undefined"></font>"
[]["entries"]() +[] // "[object Array Iterator]"
```

New characters:

`j`, `<`, `>`, `=`, `"`, `/`

### Calling method with more than one argument

Calling a method with more than one argument is non trivial - to do it you can use the following [technique](https://stackoverflow.com/q/63601330/860099) (discovered by trincot) - for example: 

calling string method `"truefalse".replace("true","1")` can be written as `["true", "1"].reduce("".replace.bind("truefalse"))` and finally:

```js
["true"]["concat"]("1")["reduce"](""["replace"]["bind"]("truefalse"))
```

calling array method `[1,2,3].slice(1,2)` can be written as `[1,2].reduce([].slice.bind([1,2,3]))` and finally:

```js
[1]["concat"](2)["reduce"]([]["slice"]["bind"]([1,2,3]))
```


### Calling string method with more than one argument in "flow way"

To be able to call a method (with multiple arguments) in right side on results of previous method you can use this [technique](https://stackoverflow.com/q/63604058/860099) (discovered by trincot) - for example: `"truefalse".replace("true","1").replace("false","0")` can be written as 

```js
"truefalse"
    .split().concat([["true", "1"]]).reduce("".replace.apply.bind("".replace))
    .split().concat([["false", "0"]]).reduce("".replace.apply.bind("".replace))
``` 

and finally:

```js
"truefalse"
  ["split"]()["concat"]([["true"]["concat"]("1")])["reduce"](""["replace"]["apply"]["bind"](""["replace"]))
  ["split"]()["concat"]([["false"]["concat"]("0")])["reduce"](""["replace"]["apply"]["bind"](""["replace"]))

```

### Calling array method with more than one argument in "flow way"

To call array methods in righthand side (flow) way" we use similar technique like for strings but with additional tricks (details [here](https://stackoverflow.com/q/63631908/860099)) presented in following example: `[3,4,5].slice(1,2).concat(6)` can be written as `[[3,4,5]].concat([[1,2]]).reduce([].slice.apply.bind([].slice)).concat(6)` (similar like for strings) but now we need to find right-hand side way to wrap array `[3,4,5]` and get `[[3,4,5]]` which can be done as follows `[3,4,5].map([].constructor).concat([[[]]])[0].slice(-1)` so we get

```js
[3,4,5]
    // call: slice(1,2) 
    .map([].constructor).concat([[[]]])[0].slice(-1)
    .concat([[1,2]]).reduce([].slice.apply.bind([].slice))
    // call next method (in flow)
    .concat(6) 
```
and finally (after remove dots and commas)

```js
[3]["concat"](4)["concat"](5)
    ["map"]([]["constructor"])["concat"]([[[]]])[0]["slice"](-1)
    ["concat"]([[1]["concat"](2)])["reduce"]([]["slice"]["apply"]["bind"]([]["slice"]))
    ["concat"](6) 
```



### `number.toString(x)` – Getting any lowercase letter

Number's `toString` method has an optional argument specifying the base to use (between 2 and 36). With base 36 we can retrieve any *lowercase* letter:

```js
10["toString"](36) // "a"
11["toString"](36) // "b"
...
34["toString"](36) // "y"
35["toString"](36) // "z"
```
Exposed characters: `abcdefghijklmnopqrstuvwxyz`

### `Function("code")()` – Evaluate Code

The Function constructor is the master key in JSFuck: It takes a String as an argument and returns a new anonymous function with this string as the function body. So it basically lets you evaluate any code as a String. This is like `eval`, without the need for a reference to the global scope (a.k.a. `window`). We can get the Function constructor e.g. with `[]["find"]["constructor"]`.

This is the first major step and an essential part of a JS-to-JSFuck compiler.
...

### `Function("return this")()` – window

When evaluating `function anonymous() { return this }`, we get the invocation context which is a reference to the global scope here: `window`!

Getting a reference to `window` is another huge step forward for JSFuck. With the brackets characters, we could only dig in the available objects: numbers, arrays, some functions... With a reference to the global scope, we now have access to any global variable and the inner properties of these globals.

### Create regular expression object

You can create regular expression e.g. `/pattern/g` as follows

```js
[]["fill"]["constructor"]("return RegExp")()("pattern","g")
```

which after removing the comma (by using [multi-arguments technique](#calling-method-with-more-than-one-argument) without `bind`ing) looks as follows

```js
["pattern"]["concat"]("g")["reduce"]([]["fill"]["constructor"]("return RegExp")())
```

---

# Alternatives


## Combine Characters

Instead of `+` we could use `.concat` to combine strings:

```js
"f"["concat"]("i")["concat"]("l")["concat"]("l") // fill
```

Problem: We need to combine "c", "o", "n", "c", "a" and "t" to get "concat".

## Booleans

The `!` might be replaced with more "powerful" characters that have more than one use.

### `=` – Boolean + Assign Values

```js
X == X // true
X == Y // false
X = Y  // assign a new value
```

### `>` – Boolean + Create Numbers

```js
X > Y  // true
X > X  // false
X >> Y // number
```

A more complex example is to get character "f" with `[]>+` only:

```js
[[ []>[] ] + [] ] [[]>>[]] [[]>>[]]
[[ false ] + [] ] [     0] [     0]
[ "false"       ] [     0] [     0]
  "false"                  [     0]
```

## Numbers

Instead of `+` we could use booleans and bitshift operators to create numbers:

```js
true >> false         // 1
true << true          // 2
true << true << true  // 4
```

Problem: Some number (like `5`) are harder to get. But it is possible when using strings, eg `"11" >> true`.

## Execute Functions

Ways of executing functions other than using `()`:

1. using backticks: `` ` ``
2. handle events: `on...`
3. constructor: `new ...`
4. type conversion: `toString|valueOf`
5. symbol datatype: `[Symbol...]`

### Using Backticks

Instead of using opening and closing parentheses, we could use backticks ` to execute functions. In ES6 they can be used to interpolate strings and serve an expression for tagged template literals.

```js
([]["entries"]``).constructor // Object
```

This would give us characters from "Object" and access to its methods.

Unfortunately, we can only pass a single string (from our basic alphabet eg. `[]!+`) as the parameter. It is not possible to call methods with multiple arguments or a precompiled string. To do that, we have to use expression interpolation using `${}` which would introduce new characters.

The possibilities of backticks were discussed in detail [in the Gitter chat room](https://gitter.im/aemkei/jsfuck).

### Mapping Type Conversion

Another approach to execute functions without parentheses would be to map the `.toString` or `.valueOf` method and call them implicitly.

```js
A = []
A["toString"] = A["pop"]
A+"" // will execute A.pop
```

Note: There is no way to pass arguments and it requires to `=` be present in our basic alphabet. And it only works for methods that return basic types.

So far the only use-case is to wire `.toSource` in Firefox to get special characters like the backslash `\`.

### Trigger Event Handler

Function or methods could also be executed by assinging them to an event hander. There are several ways to do that, e.g:

```js
// override onload event on start
onload = f

// write image tags
document.body.innerHTML = '<img onerror=f src=X />'

// throw and handle error
onerror=f; throw 'x'

// trigger event
onhashchange = f; location.hash = 1;
```

Note: We need `=` to assign the handler.

Problem: We do not have access to `window` or DOM elements to attatch the event handlers.

### Constructor

We could also use the `new` operator to call the function as a pseudo object type:

```js
new f
```

Problem: The `new` operator is not (yet) available with our basic set of symbols.

### Symbol

A symbol is a unique and immutable data type and may be used as an identifier for object properties. This can be used to implicitly call a function.

```js
f[Symbol.toPrimitive] = f;  f++;
f[Symbol.iterator]    = f; [...f];
```

Note: We need `=` to assign the function.

Problem: We do not have access to `Symbol` using our reduced character set.

# Further Readings

JSFuck was not the first approach! Many people around the world are trying to break the so-called "Wall". Read more here:

* [Esolang Wiki: JSFuck](https://esolangs.org/wiki/JSFuck)
* [sla.ckers.org](http://sla.ckers.org/forum/read.php?24,32930) – Original Discussion
* [Xchars.js](http://slides.com/sylvainpv/xchars-js/) – Sylvain Pollet-Villard
* [Non Alphanumeric JavaScript](http://patriciopalladino.com/blog/2012/08/09/non-alphanumeric-javascript.html) – Patricio Palladino
* [Non-alphanumeric code](http://www.businessinfo.co.uk/labs/talk/Nonalpha.pdf) – Gareth Heyes
* [Executing non-alphanumeric JavaScript without parenthesis](http://blog.portswigger.net/2016/07/executing-non-alphanumeric-javascript.html) – Portswigger
