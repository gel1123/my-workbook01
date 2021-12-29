import { IResBody } from "../types/api";
import { axiosInstance } from "./api";

const button = document.querySelector('#ping')
const input = <HTMLInputElement>document.querySelector('#path')
button && button.addEventListener('click', () => {
    axiosInstance.get<IResBody>(input.value).then(({data}) => {
        // dataはサーバ側のレスポンスボディだが、とくになにもしないとany型とみなされる
        // だが、上記のようにHTTPメソッドに型定義を注入してやれば、
        // dataの型をサポートすることができる
        console.log(data.message)
    })
})