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
/**
 * Mustationsの各メソッドで指定できるのは、
 * メソッド名と第二引数「payload」の型だけ。
 * これに従い、IMutationsでは、関数名とpayloadの型を定義する。
 * payloadなしなら、voidとする。
 */
interface IMutations {
  setName: {name: string};
  increment: void;
}
/** Mutations全体の型 */
type Mutations<S, M> = {
  [K in keyof M]: (state: S, payload: M[K]) => void;
}
const mutations: Mutations<State, IMutations> = {
  setName(state: State, payload) {
    // 独自定義した型注釈のおかげで型推論が有効になっている
    state.name = payload.name;
  },
  increment(state: State) {
    // 独自定義した型注釈のおかげで型推論が有効になっている
    state.count = state.count ? state.count + 1 : 1
  }
};
/**
 * Actionsの各メソッドも、Mutationsと同じく自由になるのは
 * 関数名と第二引数「payload」。
 */
interface IActions {
  asyncSetName: string;
  asyncIncrement: void;
  countup: void
}
/** CommitはMutationsのメソッド名を文字列で指定して実行する */
type Commit<M> = <T extends keyof M>(type: T, payload?: M[T]) => void;
/** DispatchはActionsのメソッド名を文字列で指定して実行する */
type Dispatch<A> = <T extends keyof A>(type: T, payload?: A[T]) => any;
type Context<S, A, G, M> = {
  commit: Commit<M>
  dispatch: Dispatch<A>
  state: S,
  getters: G
}
type Actions<S, A, G = {}, M = {}> = {
  [K in keyof A]: (ctx: Context<S, A, G, M>, payload: A[K]) => any;
}
const actions: Actions<State, IActions, IGetters, IMutations> = {
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
}
export default createStore({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions,
  modules: {
  }
})
