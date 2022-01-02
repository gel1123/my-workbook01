import { IResBody } from "../types/api";
import { axiosInstance } from "./api";

const button = document.querySelector('#ping')
const input = <HTMLInputElement>document.querySelector('#path')

// buttonは必ず存在することが担保されているため、`Non-null-assertion`で非Null宣言する
button!.addEventListener('click', () => {
    axiosInstance.get<IResBody>(input.value).then(({data}) => {
        // dataはサーバ側のレスポンスボディだが、とくになにもしないとany型とみなされる
        // だが、上記のようにHTTPメソッドに型定義を注入してやれば、
        // dataの型をサポートすることができる
        console.log(data)
    })
})

// webpack-hot-middlewareのHMRを有効化する
if (module.hot) {
    module.hot.accept()
}