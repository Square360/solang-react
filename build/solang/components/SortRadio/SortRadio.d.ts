interface MyProps {
    appId: string;
    alias: string;
    inputName: string;
}
/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
declare const SortRadio: ({ appId, alias, inputName }: MyProps) => JSX.Element;
export default SortRadio;
