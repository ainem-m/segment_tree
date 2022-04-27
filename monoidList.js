const gcd = (a, b) => {
  if (a < b) {
    // swap to keep integrity
    const t = b;
    b = a;
    a = t;
  }
  if (b == 0) return a;
  return gcd(b, a % b);
}

// List of Monoids
const monoidList = {
  // Sum monoid
  "sum": new Monoid(
    "sum", (a, b) => a + b, 0
  ),
  // Multiply Monoid
  "mul": new Monoid(
    "multiply", (a, b) => a * b, 1
  ),
  // Bitwise Xor Monoid
  "xor": new Monoid(
    "Xor", (a, b) => (a ^ b), 0
  ),
  // Bitwise Or Monoid
  "or": new Monoid(
    "Or", (a, b) => (a | b), 0
  ),
  // Bitwise And Monoid
  "and": new Monoid(
    "And", (a, b) => (a & b), 0
  ),
  // Min Monoid
  "min": new Monoid(
    "Min", (a, b) => a > b ? b : a, Infinity
  ),
  // Max Monoid
  "max": new Monoid(
    "Max", (a, b) => a > b ? a : b, -Infinity
  ),
  // GCD Monoid
  "gcd": new Monoid(
    "GCD", (a, b) => gcd(a, b), 0
  )
}

window.addEventListener("load", () => {
  Object.keys(monoidList).forEach(r => {
    const operatorSelection = document.createElement("option");
    operatorSelection.innerText = r;
    document.getElementById("segmentTreeOperator")
      .appendChild(operatorSelection);
  });
});
