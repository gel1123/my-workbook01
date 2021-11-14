import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api'
import { createUser, updateUser } from '../../../src/graphql/mutations'

const isCreateUserResult = (res: any): res is GraphQLResult<{ createUser: string }> => {
    return !!(res as GraphQLResult<{ createUser: string }>)?.data?.createUser;
}
export async function createUserApi(payload) {
    const res = await API.graphql(graphqlOperation(createUser, payload))
    if (isCreateUserResult(res)) {
        return res.data.createUser;
    }
}

const isUpdateUserResult = (res: any): res is GraphQLResult<{ updateUser: string }> => {
    return !!(res as GraphQLResult<{ updateUser: string }>)?.data?.updateUser;
}
export async function updateUserApi(user) {
    const res = await API.graphql(graphqlOperation(
        updateUser, {
        input: {
            id: user.id,
            name: user.name,
            birthday: user.birthday
        }
    }
    ))
    if (isUpdateUserResult(res)) {
        return res.data.updateUser
    }
}