import React from "react";
interface MyProps {
    appId: string;
    alias: string;
    next?: string;
    prev?: string;
    handleClick?: (arg0: React.MouseEvent<Element, MouseEvent>) => void;
}
/**
 * Provides checkbox filter for categories with result counts.
 * @param appId
 * @param alias
 * @param next
 * @param prev
 * @param handleClick Optional function to trigger on click
 * @constructor
 */
declare const SimplePager: ({ appId, alias, next, prev, handleClick }: MyProps) => JSX.Element;
export default SimplePager;
