import { ISolangApp, ISolangParamList } from "../solang.types";
interface IOptionsListOption {
    key: string;
    label: string;
    value: string;
}
export interface IOptionsListState {
    config: {
        map: {
            [key: string]: string;
        };
        exclude?: string[];
    };
    activeOptions?: IOptionsListOption[];
}
export declare function optionsListProcessParams(app: ISolangApp, filterId: string, params: ISolangParamList): void;
export {};
