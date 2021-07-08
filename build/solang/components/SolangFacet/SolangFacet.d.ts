import './SolangFacet.scss';
interface MyProps {
    appId: string;
    alias: string;
}
/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @constructor
 */
declare const SolangFacet: ({ appId, alias }: MyProps) => JSX.Element;
export default SolangFacet;
