interface MyProps {
    appId: string;
    alias: string;
    next?: string;
    prev?: string;
}
/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
declare const SortSelect: ({ appId, alias }: MyProps) => JSX.Element;
export default SortSelect;
