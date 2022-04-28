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
    // 本当は multiplication product と書かないと厳密じゃないけど product にしてあります
    "product", (a, b) => a * b, 1
  ),
  // Bitwise Xor Monoid
  "xor": new Monoid(
    "Bitwise Xor", (a, b) => (a ^ b), 0
  ),
  // Bitwise Or Monoid
  "or": new Monoid(
    "Bitwise Or", (a, b) => (a | b), 0
  ),
  // Bitwise And Monoid
  "and": new Monoid(
    "Bitwise And", (a, b) => (a & b), 0
  ),
  // Min Monoid
  "min": new Monoid(
    "min", (a, b) => a > b ? b : a, Infinity
  ),
  // Max Monoid
  "max": new Monoid(
    "max", (a, b) => a > b ? a : b, -Infinity
  ),
  // GCD Monoid
  "gcd": new Monoid(
    "GCD", (a, b) => gcd(a, b), 0
  )
}
