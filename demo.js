class A {
  constructor() {
    this.a = 1111
  }

  foo() {
    console.log(this.a)
  }
}

const ac = new A()

ac.foo()

const bar = {
  a:2222,
  baz:ac.foo
}

bar.baz()