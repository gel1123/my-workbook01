import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api'
import { getItem, listItems, } from '../../../src/graphql/queries'

const isListItemsResult = (res: any): res is GraphQLResult<{
    listItems: {
        items: [{ title: string }];
    }
}> => {
    return !!(res as GraphQLResult<{
        listItems: {
            items: [{ title: string }];
        }
    }>)?.data?.listItems;
}
export async function fetchItemListApi() {
    const res = await API.graphql(
        graphqlOperation(listItems, {
            filter: { delFlg: { eq: false } },
        })
    )
    if (isListItemsResult(res)) {
        return res.data.listItems.items;
    }
}

const isGetItemResult = (res: any): res is GraphQLResult<{ getItem: string }> => {
    return !!(res as GraphQLResult<{ getItem: string }>)?.data?.getItem;
}
export async function fetchItemApi(itemId) {
    const res = await API.graphql(
        graphqlOperation(getItem, {
            id: itemId,
        })
    )
    if (isGetItemResult(res)) {
        return res.data.getItem;
    }
}