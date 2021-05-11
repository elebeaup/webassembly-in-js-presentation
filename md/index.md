<!-- .slide: class="sfeir-basic-slide" data-background="./theme/images/bg-blue-1.jpg" -->

<div class="flex full-center">
  <img class="mb-100" src="./assets/images/WebAssembly_Logo.svg">
  <h3>WebAssembly in JS</h3>
</div>


##==##
<!-- .slide: class="transition" -->
# Un peu d'histoire...

##==##
# 2015

<div class="tweet" data-src="https://twitter.com/WebAssemblyNews/status/611205417004240896"></div>

##==##
<!-- .slide: class="flex-row" -->
# AngryBots (2016)


![h-800](./assets/images/angry_bots.jpeg)

##==##
# Google Earth Web (2019)

<div class="tweet" data-src="https://twitter.com/ChromiumDev/status/1141741351115075586"></div>

##==##
<!-- .slide: class="flex-row" -->
# Standard W3C (5 Décembre 2019)

![h-800](./assets/images/W3C.svg)

##==##
# Définition

> WebAssembly, abrégé wasm, est un standard du World Wide Web pour le développement d’applications. Il est conçu pour compléter JavaScript avec des performances supérieures. Le standard consiste en un bytecode, sa représentation textuelle et un environnement d'exécution dans un bac à sable compatible avec JavaScript. Il peut être exécuté dans un navigateur Web et en dehors.
> 
> -- <cite>wikipedia</cite>

##==##
<!-- .slide: class="full-center" -->

![h-600](./assets/images/compiling_to_wasm.png)

##==##

<!-- .slide: class="transition" -->
# Les promesses

<h5>https://developer.mozilla.org/fr/docs/WebAssembly/Concepts</h5>

##==##
<!-- .slide: class="transition underline" data-background-opacity="0.8" data-background="./assets/images/stepan-kulyk-JUI7IAP4cAM-unsplash.jpg" -->
# Ne pas casser le web

##==##
<!-- .slide: class="transition underline" data-background-opacity="0.8" data-background="./assets/images/fly-d-mT7lXZPjk7U-unsplash.jpg" -->
# Conserver la sécurité

##==##
<!-- .slide: class="transition bg-blue underline" -->
# Portable

##==##
<!-- .slide: class="full-center" -->

![h-600](./assets/images/caniuse.png)

##==##
<!-- .slide: class="full-center flex-row p-50" -->

![h-300](./assets/images/C_Logo.svg)
![h-200](./assets/images/C_Sharp_Logo.svg)
![h-200](./assets/images/C++_Logo.svg)
![h-200](./assets/images/Go_Logo.svg)
![h-200](./assets/images/Java_Logo.svg)
![h-200](./assets/images/Rust_Logo.svg)
![h-100](./assets/images/AssemblyScript_Logo.png)

##==##
<!-- .slide: class="transition underline" data-background-opacity="0.8" data-background="./assets/images/shahadat-rahman-BfrQnKBulYQ-unsplash.jpg" -->
# Être lisible et débuggable

##==##
<!-- .slide: class="with-code" data-background-opacity="0.4" data-background="./assets/images/shahadat-rahman-BfrQnKBulYQ-unsplash.jpg" -->

<div class="full-center">

```c
int add(int a, int b)
{
    return a + b;
}
```

# 

```[1-4|8]
(func $add (type $t4) (param $p0 i32) (param $p1 i32) (result i32)
  local.get $p0
  local.get $p1
  i32.add)

...

(export "add" (func $add))
```
<!-- .element: class="fragment" -->

</div>

##==##
# Type

<div class="full-center">

|Type| Description| Mapping |
|--|--|--|
| i32 | A 32-bit signed integer | Number
| u32 | A 32-bit unsigned integer | Number
| i64 | A 64-bit signed integer | BigInt 
| u64 | A 64-bit unsigned integer | BigInt
| f32 | A 32-bit float | Number
| f64 | A 64-bit float | Number

</div>

##==##
<!-- .slide: class="transition underline" data-background-opacity="0.8" data-background="./assets/images/shahadat-rahman-BfrQnKBulYQ-unsplash.jpg" -->
# String ?

##==##
<!-- .slide: class="with-code" data-background-opacity="0.4" data-background="./assets/images/shahadat-rahman-BfrQnKBulYQ-unsplash.jpg" -->

<div class="full-center">

```c
char *reverse(char *str)
{
    ...
}
```

# 

```
(func $reverse (type $t0) (param $p0 i32) (result i32)
...
```
<!-- .element: class="fragment" -->

</div>

##==##

<!-- .slide: class="flex-row full-center" -->
# Mémoire linéaire

![h-400](./assets/images/string_to_wasm_1.png)
![h-400](./assets/images/string_to_wasm_2.png)


##==##
<!-- .slide: data-auto-animate -->
# Compilation et instanciation

```js [1-2,12|1-5,12|1-8,12|1-12]
(async () => {
  const response = await fetch('lib.wasm');

  const buffer = await response.arrayBuffer();
  const module = await WebAssembly.compile(buffer);

  const importObject = { imports: { log_value: arg => console.log(arg) } };
  const instance = await WebAssembly.instantiate(module, importObject);

  const result = instance.exports.add(42, 13);
  console.log(result);
})();
```
<!-- .element: data-id="code" -->

##==##
<!-- .slide: data-auto-animate -->
# Compilation et instanciation

```js []
(async () => {
  const module = await WebAssembly.compileStreaming(fetch('lib.wasm'));

  const importObject = { imports: { log_value: arg => console.log(arg) } };
  const instance = await WebAssembly.instantiate(module, importObject);

  const result = instance.exports.add(42, 13);
  console.log(result);
})();
```
<!-- .element: data-id="code" -->

##==##
<!-- .slide: data-auto-animate -->
# Compilation et instanciation

```js []
(async () => {
  const importObject = { imports: { log_value: arg => console.log(arg) } };
  const { instance } = await WebAssembly.instantiateStreaming(fetch('lib.wasm'), importObject);

  const result = instance.exports.add(42, 13);
  console.log(result);
})();
```
<!-- .element: data-id="code" -->

##==##

<!-- .slide: class="transition" -->
# Demo

##==##
<!-- .slide: class="full-center" -->
# Emscripten

![h-800](./assets/images/emscripten.svg)

##==##

<div class="full-center">

```c
extern void log_value(char *str);

EMSCRIPTEN_KEEPALIVE int add(int a, int b)
{
    return a + b;
}

EMSCRIPTEN_KEEPALIVE void print(char *str) {
    log_value(str);
}

EMSCRIPTEN_KEEPALIVE char *reverse(char *str)
{
    ...
}
```

```js
const importObject = {
  env: {
    log_value: (strPtr) => {
      console.log(readStringToMemory(strPtr)); 
    }
  }
};

const { instance } = await WebAssembly.instantiateStreaming(fetch('lib.wasm'), importObject);
}
```
<!-- .element: class="fragment" -->

</div>

##==##
<!-- .slide: class="terminal" data-background="#a0a0ff" -->

##==##
<!-- .slide: class="transition underline" data-background-opacity="0.8" data-background="./assets/images/shahadat-rahman-BfrQnKBulYQ-unsplash.jpg" -->
# Embind

##==##

<div class="full-center">

```cpp
class Counter
{
public:
    int counter;

    Counter(int initial)
    {
        counter = initial;
    }

    void increment()
    {
        counter++;
    }

    void decrement()
    {
        counter--;
    }
};

EMSCRIPTEN_BINDINGS(my_module)
{
    class_<Counter>("MyCounter")
        .constructor<int>()
        .function("increment", &Counter::increment)
        .function("decrement", &Counter::decrement)
        .property("counter", &Counter::counter);
}
```

</div>

##==##
<!-- .slide: class="terminal" data-background="#a0a0ff" -->

##==##
<!-- .slide: class="transition" -->

# Performance

##==##
# Wasmboy (https://github.com/torch2424/wasmboy)

### **Chrome 90**
![h-350](./assets/images/wasmboy_bench_chrome.png)

### **Firefox 88**
![h-350](./assets/images/wasmboy_bench_firefox.png)

##==##
# Pspdfkit (https://pspdfkit.com/webassembly-benchmark/)

| Navigteur | Version | Score |
|--|--|--|
Chrome | WebAssembly | 3748 |
Chrome | JS | 5547 |

#   

| Navigteur | Version | Score |
|--|--|--|
Firefox | WebAssembly | 3514 |
Firefox | JS | 8301 |

#  

_The score is the total benchmark time. The lower the score, the better._

##==##
<!-- .slide: class="speaker-slide blue" -->

![speaker](./assets/images/emmanuel_lebeaupin.jpg)
![company](./assets/images/logo-sfeir-blanc.png)

<h2> Emmanuel<span> Lebeaupin</span></h2>

### Développeur Fullstack
<!-- .element: class="icon-rule icon-first" -->

### @elebeaup
<!-- .element: class="icon-twitter icon-second" -->

##==##
<!-- .slide: class="transition" -->

# Merci

##==##

<!-- .slide: data-background="./assets/images/Thats_all_folks.svg" -->