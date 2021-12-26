import { createStore } from 'vuex'

interface State {
  count: number | null;
  name: string | null;
}
const state: State = {
  count: 0,
  name: null
}
/** Storeの「getters」が内包するメソッドのキーと返り値の型 */
interface IGetters {
  getName: string | null;
  greet: string;
}
/** Storeの「getters」全体としての型定義。これでゲッターが別のゲッターを参照する際の静的検査が有効になる */
type Getters<S, G> = {
  [K in keyof G]: (state: S, getters: G) => G[K];
};
const getters:Getters<State, IGetters> = {
  getName(state: State, getters) {
    return state.name
  },
  greet(state: State, getters) {
    //type Getters<State, IGetters> により、変数gettersが型定義され、
    // 下記のエラーを事前に検出できるようになる。
    // （なにも対策を練らないと、gettersはany型となってしまうため、このような自前の型定義が必要）
    // return `My name is ${getters.getName.toUpperCase()}`

    // コンパイルエラーが出ないよう書くなら、こう
    return `My name is ${getters.getName?.toUpperCase()}`;
  }
}

export default createStore({
  state: state,
  getters: getters,
  mutations: {
    setName(state: State, payload) {
      // state.name = payload; // payloadもany。なのでスキーマ誤りを検出できない
      state.name = payload.name;
    },
    increment(state: State, payload) {
      // state.count++; // これはコンパイルエラー（nullかもしれないから）
    }
  },
  actions: {
    asyncSetName(ctx, payload) {
      ctx.commit('setName', {name: payload});
      console.log(ctx.state.name);
    },
    asyncIncrement(ctx) {
      ctx.commit('increment');
      console.log(ctx.state.count);
    },
    async countup(ctx) {
      await (() => new Promise(resolve => {
        setTimeout(resolve, 1000);
      }))();

      // dispatchはActionの実行。ここでしたいのはMutationの実行なのでcommitが正しい
      // だが、こう書いても実行するまでエラーが出ない
      // ctx.dispatch('increment');
      ctx.commit('increment');
    }
  },
  modules: {
  }
})
