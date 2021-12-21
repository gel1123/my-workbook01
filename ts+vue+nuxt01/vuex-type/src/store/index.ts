import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0 as number | null,
    name: null as string | null,
  },
  getters: {
    getName(state, getters) {
      return state.name
    },
    /** コンパイルエラーは出ないが、実際に実行すると「Error: Cannot read properties of null」 */
    greet(state, getters) {
      // gettersがany型であるために、getNameもany型になる。その結果、nullの可能性を検出できない
      return `My name is ${getters.getName.toUpperCase()}`
    }
  },
  mutations: {
    setName(state, payload) {
      // state.name = payload; // payloadもany。なのでスキーマ誤りを検出できない
      state.name = payload.name;
    },
    increment(state, payload) {
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
