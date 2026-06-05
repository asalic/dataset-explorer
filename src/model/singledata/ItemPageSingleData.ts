import ItemPage from "../ItemPage";

export default interface ItemPageSingleData<T_ITEM> extends ItemPage<T_ITEM> {
    allowedActionsForTheUser: string[];

}