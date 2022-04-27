class Monoid {
  constructor(name, op, e) {
    // The name of monoid
    this.name = name;

    // The binary operation used on segtree
    this.op = op;
  
    // The identity element of the operation
    this.e = e;
  }
}
