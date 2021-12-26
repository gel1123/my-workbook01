const message: string = "hello";
const hasValue: boolean = false;
const count: number = 10;

/**
 * ちなみに...
 *  => 引数には型推論が効かない
 *  => 戻り値には型推論が効く
 */
const add = function (a: number, b: number): number {
    return a + b;
};
/** 戻り値なしならvoid型 */
const consumer = function (anything: any): void {
    console.log(anything);
};

/**
 * 下記以外にも obj: object もあるが、
 * tsの型注釈「object」は、プロパティへのアクセスを拒絶する
 */
const obj: {
    id: number,
    val: string,
    nest: {
        isNest: boolean
    }
} = {
    id: 1,
    val: "hoge",
    nest: {
        isNest: true
    }
};

const strArray: string[] = ["hoge", "fuge"];
/** union型の配列 */
const unionArray: (string | number | boolean)[] = ["str", 100, false, 200];
/**
 * union型の配列は個数制限できないが、タプルなら
 * 「定義時」「参照時」に配列サイズと各indexの型順を固定できる。
 */
const tuple: [string, number, boolean] = ["s", 1, false];

/** リテラル型 */
const hoge: "hoge" = "hoge";
/** リテラルをconstで定義したら自動的にリテラル型として扱われる */
const fuge = "fuge";
/** いずれかの値を示す（リテラルとユニオンの応用。Enumの代わりに使える） */
let abc: "a" | "b" | "c" = "a";

/** 型の定義 */
type Size = "short" | "tall";
let size: Size = "short";

/** 関数の型注釈 */
const func: (num: number, str: string) => string = (num, str) => num + str;
/** コールバックの型注釈 */
const doubleNum: (num: number) => number = num => num * 2;
const xargsConsumer: (num: number, cb: (n: number) => number) => void = (
    (num, cb) => console.log(cb(num))
);
xargsConsumer(2, doubleNum);

/** never型（TSバージョン3以降に登場。起こり得ない型） */
const throwError = () => {
    // returnに到達し得ないので、戻り値はvoidというより「到達しない」を示すneverが妥当
    throw new Error();
};

