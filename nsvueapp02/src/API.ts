/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAddressInput = {
  id?: string | null,
  zipCode?: number | null,
  address?: string | null,
  building?: string | null,
  recipient?: string | null,
  userId?: string | null,
};

export type ModelAddressConditionInput = {
  zipCode?: ModelIntInput | null,
  address?: ModelStringInput | null,
  building?: ModelStringInput | null,
  recipient?: ModelStringInput | null,
  userId?: ModelIDInput | null,
  and?: Array< ModelAddressConditionInput | null > | null,
  or?: Array< ModelAddressConditionInput | null > | null,
  not?: ModelAddressConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Address = {
  __typename: "Address",
  id: string,
  zipCode?: number | null,
  address?: string | null,
  building?: string | null,
  recipient?: string | null,
  userId?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateAddressInput = {
  id: string,
  zipCode?: number | null,
  address?: string | null,
  building?: string | null,
  recipient?: string | null,
  userId?: string | null,
};

export type DeleteAddressInput = {
  id: string,
};

export type CreateAdminInput = {
  id?: string | null,
  name: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelAdminConditionInput = {
  name?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAdminConditionInput | null > | null,
  or?: Array< ModelAdminConditionInput | null > | null,
  not?: ModelAdminConditionInput | null,
};

export type Admin = {
  __typename: "Admin",
  id: string,
  name: string,
  item?: ModelItemConnection | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelItemConnection = {
  __typename: "ModelItemConnection",
  items?:  Array<Item | null > | null,
  nextToken?: string | null,
};

export type Item = {
  __typename: "Item",
  id: string,
  title: string,
  price: number,
  brand?: string | null,
  maker?: string | null,
  origin?: string | null,
  ingredient?: string | null,
  alcohol?: number | null,
  capacity?: number | null,
  sakeDegree?: string | null,
  descripttion?: string | null,
  deliveryFee?: number | null,
  image?: string | null,
  delFlg?: boolean | null,
  adminId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateAdminInput = {
  id: string,
  name?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteAdminInput = {
  id: string,
};

export type CreateCartInput = {
  id?: string | null,
  userId: string,
  itemId: string,
  count?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelCartConditionInput = {
  userId?: ModelIDInput | null,
  itemId?: ModelIDInput | null,
  count?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelCartConditionInput | null > | null,
  or?: Array< ModelCartConditionInput | null > | null,
  not?: ModelCartConditionInput | null,
};

export type Cart = {
  __typename: "Cart",
  id: string,
  userId: string,
  itemId: string,
  count?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateCartInput = {
  id: string,
  userId?: string | null,
  itemId?: string | null,
  count?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteCartInput = {
  id: string,
};

export type CreateFavoriteInput = {
  id?: string | null,
  userId: string,
  itemId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelFavoriteConditionInput = {
  userId?: ModelIDInput | null,
  itemId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFavoriteConditionInput | null > | null,
  or?: Array< ModelFavoriteConditionInput | null > | null,
  not?: ModelFavoriteConditionInput | null,
};

export type Favorite = {
  __typename: "Favorite",
  id: string,
  userId: string,
  itemId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateFavoriteInput = {
  id: string,
  userId?: string | null,
  itemId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteFavoriteInput = {
  id: string,
};

export type CreateHistoryInput = {
  id?: string | null,
  userId: string,
  itemId: string,
  itemTitle: string,
  itemPrice: number,
  itemCount: number,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelHistoryConditionInput = {
  userId?: ModelIDInput | null,
  itemId?: ModelIDInput | null,
  itemTitle?: ModelStringInput | null,
  itemPrice?: ModelIntInput | null,
  itemCount?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelHistoryConditionInput | null > | null,
  or?: Array< ModelHistoryConditionInput | null > | null,
  not?: ModelHistoryConditionInput | null,
};

export type History = {
  __typename: "History",
  id: string,
  userId: string,
  itemId: string,
  itemTitle: string,
  itemPrice: number,
  itemCount: number,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateHistoryInput = {
  id: string,
  userId?: string | null,
  itemId?: string | null,
  itemTitle?: string | null,
  itemPrice?: number | null,
  itemCount?: number | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteHistoryInput = {
  id: string,
};

export type CreateItemInput = {
  id?: string | null,
  title: string,
  price: number,
  brand?: string | null,
  maker?: string | null,
  origin?: string | null,
  ingredient?: string | null,
  alcohol?: number | null,
  capacity?: number | null,
  sakeDegree?: string | null,
  descripttion?: string | null,
  deliveryFee?: number | null,
  image?: string | null,
  delFlg?: boolean | null,
  adminId: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelItemConditionInput = {
  title?: ModelStringInput | null,
  price?: ModelIntInput | null,
  brand?: ModelStringInput | null,
  maker?: ModelStringInput | null,
  origin?: ModelStringInput | null,
  ingredient?: ModelStringInput | null,
  alcohol?: ModelFloatInput | null,
  capacity?: ModelIntInput | null,
  sakeDegree?: ModelStringInput | null,
  descripttion?: ModelStringInput | null,
  deliveryFee?: ModelIntInput | null,
  image?: ModelStringInput | null,
  delFlg?: ModelBooleanInput | null,
  adminId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelItemConditionInput | null > | null,
  or?: Array< ModelItemConditionInput | null > | null,
  not?: ModelItemConditionInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateItemInput = {
  id: string,
  title?: string | null,
  price?: number | null,
  brand?: string | null,
  maker?: string | null,
  origin?: string | null,
  ingredient?: string | null,
  alcohol?: number | null,
  capacity?: number | null,
  sakeDegree?: string | null,
  descripttion?: string | null,
  deliveryFee?: number | null,
  image?: string | null,
  delFlg?: boolean | null,
  adminId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteItemInput = {
  id: string,
};

export type CreateUserInput = {
  id?: string | null,
  name: string,
  birthday: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  birthday?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type User = {
  __typename: "User",
  id: string,
  name: string,
  birthday: string,
  addresses?: ModelAddressConnection | null,
  histories?: ModelHistoryConnection | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelAddressConnection = {
  __typename: "ModelAddressConnection",
  items?:  Array<Address | null > | null,
  nextToken?: string | null,
};

export type ModelHistoryConnection = {
  __typename: "ModelHistoryConnection",
  items?:  Array<History | null > | null,
  nextToken?: string | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
  birthday?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type ModelAddressFilterInput = {
  id?: ModelIDInput | null,
  zipCode?: ModelIntInput | null,
  address?: ModelStringInput | null,
  building?: ModelStringInput | null,
  recipient?: ModelStringInput | null,
  userId?: ModelIDInput | null,
  and?: Array< ModelAddressFilterInput | null > | null,
  or?: Array< ModelAddressFilterInput | null > | null,
  not?: ModelAddressFilterInput | null,
};

export type ModelAdminFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAdminFilterInput | null > | null,
  or?: Array< ModelAdminFilterInput | null > | null,
  not?: ModelAdminFilterInput | null,
};

export type ModelAdminConnection = {
  __typename: "ModelAdminConnection",
  items?:  Array<Admin | null > | null,
  nextToken?: string | null,
};

export type ModelCartFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  itemId?: ModelIDInput | null,
  count?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelCartFilterInput | null > | null,
  or?: Array< ModelCartFilterInput | null > | null,
  not?: ModelCartFilterInput | null,
};

export type ModelCartConnection = {
  __typename: "ModelCartConnection",
  items?:  Array<Cart | null > | null,
  nextToken?: string | null,
};

export type ModelFavoriteFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  itemId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelFavoriteFilterInput | null > | null,
  or?: Array< ModelFavoriteFilterInput | null > | null,
  not?: ModelFavoriteFilterInput | null,
};

export type ModelFavoriteConnection = {
  __typename: "ModelFavoriteConnection",
  items?:  Array<Favorite | null > | null,
  nextToken?: string | null,
};

export type ModelHistoryFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  itemId?: ModelIDInput | null,
  itemTitle?: ModelStringInput | null,
  itemPrice?: ModelIntInput | null,
  itemCount?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelHistoryFilterInput | null > | null,
  or?: Array< ModelHistoryFilterInput | null > | null,
  not?: ModelHistoryFilterInput | null,
};

export type ModelItemFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  price?: ModelIntInput | null,
  brand?: ModelStringInput | null,
  maker?: ModelStringInput | null,
  origin?: ModelStringInput | null,
  ingredient?: ModelStringInput | null,
  alcohol?: ModelFloatInput | null,
  capacity?: ModelIntInput | null,
  sakeDegree?: ModelStringInput | null,
  descripttion?: ModelStringInput | null,
  deliveryFee?: ModelIntInput | null,
  image?: ModelStringInput | null,
  delFlg?: ModelBooleanInput | null,
  adminId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelItemFilterInput | null > | null,
  or?: Array< ModelItemFilterInput | null > | null,
  not?: ModelItemFilterInput | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  birthday?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items?:  Array<User | null > | null,
  nextToken?: string | null,
};

export type CreateAddressMutationVariables = {
  input: CreateAddressInput,
  condition?: ModelAddressConditionInput | null,
};

export type CreateAddressMutation = {
  createAddress?:  {
    __typename: "Address",
    id: string,
    zipCode?: number | null,
    address?: string | null,
    building?: string | null,
    recipient?: string | null,
    userId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAddressMutationVariables = {
  input: UpdateAddressInput,
  condition?: ModelAddressConditionInput | null,
};

export type UpdateAddressMutation = {
  updateAddress?:  {
    __typename: "Address",
    id: string,
    zipCode?: number | null,
    address?: string | null,
    building?: string | null,
    recipient?: string | null,
    userId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAddressMutationVariables = {
  input: DeleteAddressInput,
  condition?: ModelAddressConditionInput | null,
};

export type DeleteAddressMutation = {
  deleteAddress?:  {
    __typename: "Address",
    id: string,
    zipCode?: number | null,
    address?: string | null,
    building?: string | null,
    recipient?: string | null,
    userId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateAdminMutationVariables = {
  input: CreateAdminInput,
  condition?: ModelAdminConditionInput | null,
};

export type CreateAdminMutation = {
  createAdmin?:  {
    __typename: "Admin",
    id: string,
    name: string,
    item?:  {
      __typename: "ModelItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateAdminMutationVariables = {
  input: UpdateAdminInput,
  condition?: ModelAdminConditionInput | null,
};

export type UpdateAdminMutation = {
  updateAdmin?:  {
    __typename: "Admin",
    id: string,
    name: string,
    item?:  {
      __typename: "ModelItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteAdminMutationVariables = {
  input: DeleteAdminInput,
  condition?: ModelAdminConditionInput | null,
};

export type DeleteAdminMutation = {
  deleteAdmin?:  {
    __typename: "Admin",
    id: string,
    name: string,
    item?:  {
      __typename: "ModelItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateCartMutationVariables = {
  input: CreateCartInput,
  condition?: ModelCartConditionInput | null,
};

export type CreateCartMutation = {
  createCart?:  {
    __typename: "Cart",
    id: string,
    userId: string,
    itemId: string,
    count?: number | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateCartMutationVariables = {
  input: UpdateCartInput,
  condition?: ModelCartConditionInput | null,
};

export type UpdateCartMutation = {
  updateCart?:  {
    __typename: "Cart",
    id: string,
    userId: string,
    itemId: string,
    count?: number | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteCartMutationVariables = {
  input: DeleteCartInput,
  condition?: ModelCartConditionInput | null,
};

export type DeleteCartMutation = {
  deleteCart?:  {
    __typename: "Cart",
    id: string,
    userId: string,
    itemId: string,
    count?: number | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateFavoriteMutationVariables = {
  input: CreateFavoriteInput,
  condition?: ModelFavoriteConditionInput | null,
};

export type CreateFavoriteMutation = {
  createFavorite?:  {
    __typename: "Favorite",
    id: string,
    userId: string,
    itemId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateFavoriteMutationVariables = {
  input: UpdateFavoriteInput,
  condition?: ModelFavoriteConditionInput | null,
};

export type UpdateFavoriteMutation = {
  updateFavorite?:  {
    __typename: "Favorite",
    id: string,
    userId: string,
    itemId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteFavoriteMutationVariables = {
  input: DeleteFavoriteInput,
  condition?: ModelFavoriteConditionInput | null,
};

export type DeleteFavoriteMutation = {
  deleteFavorite?:  {
    __typename: "Favorite",
    id: string,
    userId: string,
    itemId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateHistoryMutationVariables = {
  input: CreateHistoryInput,
  condition?: ModelHistoryConditionInput | null,
};

export type CreateHistoryMutation = {
  createHistory?:  {
    __typename: "History",
    id: string,
    userId: string,
    itemId: string,
    itemTitle: string,
    itemPrice: number,
    itemCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateHistoryMutationVariables = {
  input: UpdateHistoryInput,
  condition?: ModelHistoryConditionInput | null,
};

export type UpdateHistoryMutation = {
  updateHistory?:  {
    __typename: "History",
    id: string,
    userId: string,
    itemId: string,
    itemTitle: string,
    itemPrice: number,
    itemCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteHistoryMutationVariables = {
  input: DeleteHistoryInput,
  condition?: ModelHistoryConditionInput | null,
};

export type DeleteHistoryMutation = {
  deleteHistory?:  {
    __typename: "History",
    id: string,
    userId: string,
    itemId: string,
    itemTitle: string,
    itemPrice: number,
    itemCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateItemMutationVariables = {
  input: CreateItemInput,
  condition?: ModelItemConditionInput | null,
};

export type CreateItemMutation = {
  createItem?:  {
    __typename: "Item",
    id: string,
    title: string,
    price: number,
    brand?: string | null,
    maker?: string | null,
    origin?: string | null,
    ingredient?: string | null,
    alcohol?: number | null,
    capacity?: number | null,
    sakeDegree?: string | null,
    descripttion?: string | null,
    deliveryFee?: number | null,
    image?: string | null,
    delFlg?: boolean | null,
    adminId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateItemMutationVariables = {
  input: UpdateItemInput,
  condition?: ModelItemConditionInput | null,
};

export type UpdateItemMutation = {
  updateItem?:  {
    __typename: "Item",
    id: string,
    title: string,
    price: number,
    brand?: string | null,
    maker?: string | null,
    origin?: string | null,
    ingredient?: string | null,
    alcohol?: number | null,
    capacity?: number | null,
    sakeDegree?: string | null,
    descripttion?: string | null,
    deliveryFee?: number | null,
    image?: string | null,
    delFlg?: boolean | null,
    adminId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteItemMutationVariables = {
  input: DeleteItemInput,
  condition?: ModelItemConditionInput | null,
};

export type DeleteItemMutation = {
  deleteItem?:  {
    __typename: "Item",
    id: string,
    title: string,
    price: number,
    brand?: string | null,
    maker?: string | null,
    origin?: string | null,
    ingredient?: string | null,
    alcohol?: number | null,
    capacity?: number | null,
    sakeDegree?: string | null,
    descripttion?: string | null,
    deliveryFee?: number | null,
    image?: string | null,
    delFlg?: boolean | null,
    adminId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name: string,
    birthday: string,
    addresses?:  {
      __typename: "ModelAddressConnection",
      nextToken?: string | null,
    } | null,
    histories?:  {
      __typename: "ModelHistoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    birthday: string,
    addresses?:  {
      __typename: "ModelAddressConnection",
      nextToken?: string | null,
    } | null,
    histories?:  {
      __typename: "ModelHistoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    birthday: string,
    addresses?:  {
      __typename: "ModelAddressConnection",
      nextToken?: string | null,
    } | null,
    histories?:  {
      __typename: "ModelHistoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type GetAddressQueryVariables = {
  id: string,
};

export type GetAddressQuery = {
  getAddress?:  {
    __typename: "Address",
    id: string,
    zipCode?: number | null,
    address?: string | null,
    building?: string | null,
    recipient?: string | null,
    userId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAddresssQueryVariables = {
  filter?: ModelAddressFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAddresssQuery = {
  listAddresss?:  {
    __typename: "ModelAddressConnection",
    items?:  Array< {
      __typename: "Address",
      id: string,
      zipCode?: number | null,
      address?: string | null,
      building?: string | null,
      recipient?: string | null,
      userId?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetAdminQueryVariables = {
  id: string,
};

export type GetAdminQuery = {
  getAdmin?:  {
    __typename: "Admin",
    id: string,
    name: string,
    item?:  {
      __typename: "ModelItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListAdminsQueryVariables = {
  filter?: ModelAdminFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAdminsQuery = {
  listAdmins?:  {
    __typename: "ModelAdminConnection",
    items?:  Array< {
      __typename: "Admin",
      id: string,
      name: string,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetCartQueryVariables = {
  id: string,
};

export type GetCartQuery = {
  getCart?:  {
    __typename: "Cart",
    id: string,
    userId: string,
    itemId: string,
    count?: number | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListCartsQueryVariables = {
  filter?: ModelCartFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCartsQuery = {
  listCarts?:  {
    __typename: "ModelCartConnection",
    items?:  Array< {
      __typename: "Cart",
      id: string,
      userId: string,
      itemId: string,
      count?: number | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetFavoriteQueryVariables = {
  id: string,
};

export type GetFavoriteQuery = {
  getFavorite?:  {
    __typename: "Favorite",
    id: string,
    userId: string,
    itemId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListFavoritesQueryVariables = {
  filter?: ModelFavoriteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFavoritesQuery = {
  listFavorites?:  {
    __typename: "ModelFavoriteConnection",
    items?:  Array< {
      __typename: "Favorite",
      id: string,
      userId: string,
      itemId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetHistoryQueryVariables = {
  id: string,
};

export type GetHistoryQuery = {
  getHistory?:  {
    __typename: "History",
    id: string,
    userId: string,
    itemId: string,
    itemTitle: string,
    itemPrice: number,
    itemCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListHistorysQueryVariables = {
  filter?: ModelHistoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListHistorysQuery = {
  listHistorys?:  {
    __typename: "ModelHistoryConnection",
    items?:  Array< {
      __typename: "History",
      id: string,
      userId: string,
      itemId: string,
      itemTitle: string,
      itemPrice: number,
      itemCount: number,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetItemQueryVariables = {
  id: string,
};

export type GetItemQuery = {
  getItem?:  {
    __typename: "Item",
    id: string,
    title: string,
    price: number,
    brand?: string | null,
    maker?: string | null,
    origin?: string | null,
    ingredient?: string | null,
    alcohol?: number | null,
    capacity?: number | null,
    sakeDegree?: string | null,
    descripttion?: string | null,
    deliveryFee?: number | null,
    image?: string | null,
    delFlg?: boolean | null,
    adminId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListItemsQueryVariables = {
  filter?: ModelItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListItemsQuery = {
  listItems?:  {
    __typename: "ModelItemConnection",
    items?:  Array< {
      __typename: "Item",
      id: string,
      title: string,
      price: number,
      brand?: string | null,
      maker?: string | null,
      origin?: string | null,
      ingredient?: string | null,
      alcohol?: number | null,
      capacity?: number | null,
      sakeDegree?: string | null,
      descripttion?: string | null,
      deliveryFee?: number | null,
      image?: string | null,
      delFlg?: boolean | null,
      adminId: string,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name: string,
    birthday: string,
    addresses?:  {
      __typename: "ModelAddressConnection",
      nextToken?: string | null,
    } | null,
    histories?:  {
      __typename: "ModelHistoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items?:  Array< {
      __typename: "User",
      id: string,
      name: string,
      birthday: string,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateAddressSubscription = {
  onCreateAddress?:  {
    __typename: "Address",
    id: string,
    zipCode?: number | null,
    address?: string | null,
    building?: string | null,
    recipient?: string | null,
    userId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAddressSubscription = {
  onUpdateAddress?:  {
    __typename: "Address",
    id: string,
    zipCode?: number | null,
    address?: string | null,
    building?: string | null,
    recipient?: string | null,
    userId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAddressSubscription = {
  onDeleteAddress?:  {
    __typename: "Address",
    id: string,
    zipCode?: number | null,
    address?: string | null,
    building?: string | null,
    recipient?: string | null,
    userId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAdminSubscription = {
  onCreateAdmin?:  {
    __typename: "Admin",
    id: string,
    name: string,
    item?:  {
      __typename: "ModelItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateAdminSubscription = {
  onUpdateAdmin?:  {
    __typename: "Admin",
    id: string,
    name: string,
    item?:  {
      __typename: "ModelItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteAdminSubscription = {
  onDeleteAdmin?:  {
    __typename: "Admin",
    id: string,
    name: string,
    item?:  {
      __typename: "ModelItemConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateCartSubscription = {
  onCreateCart?:  {
    __typename: "Cart",
    id: string,
    userId: string,
    itemId: string,
    count?: number | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateCartSubscription = {
  onUpdateCart?:  {
    __typename: "Cart",
    id: string,
    userId: string,
    itemId: string,
    count?: number | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteCartSubscription = {
  onDeleteCart?:  {
    __typename: "Cart",
    id: string,
    userId: string,
    itemId: string,
    count?: number | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateFavoriteSubscription = {
  onCreateFavorite?:  {
    __typename: "Favorite",
    id: string,
    userId: string,
    itemId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateFavoriteSubscription = {
  onUpdateFavorite?:  {
    __typename: "Favorite",
    id: string,
    userId: string,
    itemId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteFavoriteSubscription = {
  onDeleteFavorite?:  {
    __typename: "Favorite",
    id: string,
    userId: string,
    itemId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateHistorySubscription = {
  onCreateHistory?:  {
    __typename: "History",
    id: string,
    userId: string,
    itemId: string,
    itemTitle: string,
    itemPrice: number,
    itemCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateHistorySubscription = {
  onUpdateHistory?:  {
    __typename: "History",
    id: string,
    userId: string,
    itemId: string,
    itemTitle: string,
    itemPrice: number,
    itemCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteHistorySubscription = {
  onDeleteHistory?:  {
    __typename: "History",
    id: string,
    userId: string,
    itemId: string,
    itemTitle: string,
    itemPrice: number,
    itemCount: number,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateItemSubscription = {
  onCreateItem?:  {
    __typename: "Item",
    id: string,
    title: string,
    price: number,
    brand?: string | null,
    maker?: string | null,
    origin?: string | null,
    ingredient?: string | null,
    alcohol?: number | null,
    capacity?: number | null,
    sakeDegree?: string | null,
    descripttion?: string | null,
    deliveryFee?: number | null,
    image?: string | null,
    delFlg?: boolean | null,
    adminId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateItemSubscription = {
  onUpdateItem?:  {
    __typename: "Item",
    id: string,
    title: string,
    price: number,
    brand?: string | null,
    maker?: string | null,
    origin?: string | null,
    ingredient?: string | null,
    alcohol?: number | null,
    capacity?: number | null,
    sakeDegree?: string | null,
    descripttion?: string | null,
    deliveryFee?: number | null,
    image?: string | null,
    delFlg?: boolean | null,
    adminId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteItemSubscription = {
  onDeleteItem?:  {
    __typename: "Item",
    id: string,
    title: string,
    price: number,
    brand?: string | null,
    maker?: string | null,
    origin?: string | null,
    ingredient?: string | null,
    alcohol?: number | null,
    capacity?: number | null,
    sakeDegree?: string | null,
    descripttion?: string | null,
    deliveryFee?: number | null,
    image?: string | null,
    delFlg?: boolean | null,
    adminId: string,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    birthday: string,
    addresses?:  {
      __typename: "ModelAddressConnection",
      nextToken?: string | null,
    } | null,
    histories?:  {
      __typename: "ModelHistoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    birthday: string,
    addresses?:  {
      __typename: "ModelAddressConnection",
      nextToken?: string | null,
    } | null,
    histories?:  {
      __typename: "ModelHistoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    birthday: string,
    addresses?:  {
      __typename: "ModelAddressConnection",
      nextToken?: string | null,
    } | null,
    histories?:  {
      __typename: "ModelHistoryConnection",
      nextToken?: string | null,
    } | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};
