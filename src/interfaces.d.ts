declare module 'interfaces' {
    interface ItemType {
        [id: string]: string,
        [title: string]: string,
        [url: string]: string,
        [icon: string]: string,
        [author: string]: string,
        [date: string]: string,
        [length: string]: string
    };
    type ItemListType = ItemType[];

    type SortOrder = "asc" | "desc" | -1 | 1;
    type FilterType = {
        sort: SortOrder | "normal",
        options: string[]
    };
    type FiltersType = { [key: string]: string[] };
    type AppFiltersType = { [key: string]: FilterType };

    type SorterType = {
        name: string,
        direction: SortOrder
    };
    type SortersType = SorterType[];

    interface AppState {
        results: ItemListType,
        filtering: boolean,
        configuring: boolean,
        integrating: boolean,
        filters: AppFiltersType
    };
    export {
        ItemType,
        ItemListType,
        FiltersType,
        SortersType,
        SortOrder,
        AppState,
        AppFiltersType
    };
}