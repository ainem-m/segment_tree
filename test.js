var segTree = new Vue({
  el: '#segTree',
  data: {
    typeOfSegmentTree: 'sum',
    operationName: "sum",
    monoidList: monoidList,
    n: 4,
    size: 4, //nを2のべき乗にならした数
    rowSize: 3,
    arr: '1 2 3 4',
    l: 1, r: 3,
    res: 3,
    i: 2, x: 2,
    values: [0, 10, 3, 7, 1, 2, 3, 4],
    names: [[''], ['1~4'], ['1~2'], ['3~4'], ['1'], ['2'], ['3'], ['4']],
    selected: [false, false, false, false, false, false, false, false],
    DELAY: 600
  },
  methods: {
    getValue: function (i) {
      // values[i]の値を返す　もしInfinityか-Infinityならば'∞', '-∞'を返す
      if (this.values[i] === Number.POSITIVE_INFINITY) return '∞';
      if (this.values[i] === Number.NEGATIVE_INFINITY) return '-∞';
      else return this.values[i];
    },
    getSizeOfSegmentTree: function (n) {
      // n:Number -> Number
      // n以上の最小の2のべき乗の数を求める
      //var k = Math.log2(n);
      //return 2 ** Math.ceil(k);
      return n;
    },
    getRandomInt: function (min, max) {
      // min:Number, max:Number -> Number
      // [min, max) の範囲でランダムな整数を返す
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    },
    resetSelected: function () {
      // -> None
      // セルの選択をリセットする
      this.selected.fill(false);
    },
    init: function () {
      // セグ木の初期化
      // this.values, this.names, this.n, this.size, this.rowSizeを変更
      var args = this.arr.split(" ").map(Number)
      var n = Number(this.n);
      var size = this.getSizeOfSegmentTree(n);
      var values = Array(size * 2);
      var names = Array(size * 2);
      var selected = Array(size * 2);
      this.resetSelected()
      //values.fill(Number(monoidList[this.typeOfSegmentTree].e))
      for (i = 0; i < size; i++) {
        // 最下段に元の値を代入　欠損あれば単位元で埋める
        if (i < n) values[i + size] = args[i] ? args[i] : monoidList[this.typeOfSegmentTree].e;
        names[i + size] = [(i + 1).toString()]
      }
      for (i = size - 1; i > 0; i--) {
        // 下から二段目から上へ計算
        if (!names[i*2] || !names[i*2+1] || (Number(names[i*2].at(0) > Number(names[i*2+1].at(-1))))) continue;
        values[i] = monoidList[this.typeOfSegmentTree].op(values[i * 2], values[i * 2 + 1]);
        names[i] = [names[i * 2].at(0), "~", names[i * 2 + 1].at(-1)];
      }
      // 以下returnの代わり
      this.values = values;
      this.names = names;
      this.selected = selected;
      this.n = n;
      this.size = size;
      this.rowSize = Math.ceil(Math.log2(n)) + 1;
      this.operationName = monoidList[this.typeOfSegmentTree].name
    },
    randomfill: function () {
      // 配列の欠損値を1~9の整数で埋める
      var n = this.n;
      var arr = Array(n);
      for (i = 0; i < n; i++) {
        arr[i] = this.getRandomInt(1, 10);
      }
      this.arr = arr.join(' ');
    },
    query: function () {
      loop = (l, r, tmp) => {
        // 再帰の終了条件
        if (l >= r) {
          this.res = tmp;
          return;
        }
        // 加算するか検討するセルを塗る
        this.selected[l] = true;
        this.selected[r - 1] = true;
        this.selected.splice();
        if (l & 1) {
          // |.....|->
          // |..|**|
          // 左端・右の子(処理に含める)
          tmp = monoidList[this.typeOfSegmentTree].op(tmp, this.values[l++]);
        } else if (l !== r - 1) {
          // |->...|
          // |->|..|
          // 左端・左の子(処理に含めない)
          // 両端が一致している場合(l == r-1)は除く
          this.selected[l] = false;
        }
        if (r & 1) {
          // |<-...|
          // |**|<-|
          // 右端・右の子(処理に含める)
          tmp = monoidList[this.typeOfSegmentTree].op(tmp, this.values[--r]);
        } else if (l !== r) {
          // |<-...|
          // |<-|..|
          // 右端・左の股(処理に含めない)
          // 両端が一致している場合は除く
          this.selected[r - 1] = false;
        }
        // 次の区間へ
        l >>= 1; r >>= 1;
        this.values.splice();
        // DELAY(ms)後に次の区間の処理へ
        setTimeout(() => { loop(l, r, tmp) }, this.DELAY);
      }
      var tmp = monoidList[this.typeOfSegmentTree].e;
      if (Number(this.l) < 1 || Number(this.l) > Number(this.r)) {
        this.l = 1;
        console.log("l must be less than r and more than 0");
      }
      if (Number(this.r) > this.n+1) {
        this.r = this.n+1;
        console.log("r must be less than n")
      }
      var l = Number(this.l) - 1;
      var r = Number(this.r) - 1;
      // 配列の添字からセグ木配列の添字に変換
      l += this.size;
      r += this.size;
      this.resetSelected();
      loop(l, r, tmp);
    },
    update: function () {
      var i = Number(this.i) - 1;
      var x = Number(this.x);
      this.resetSelected();
      i += this.size;
      this.values[i] = x;
      loop = (i) => {
        // 再帰の終了条件
        if (i <= 0) return;
        i >>= 1;
        this.selected[i] = true;
        this.values.splice();
        this.values[i] = monoidList[this.typeOfSegmentTree].op(this.values[2 * i], this.values[2 * i + 1]);
        setTimeout(() => { loop(i) }, this.DELAY)
      }
      setTimeout(() => {
        this.selected[i] = true;
        this.values.splice();
        loop(i);
      }, this.DELAY)
    }
  }

})
