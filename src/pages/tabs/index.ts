import Field from "./Field";
import Graph from "./Graph";
import Docs from "./Docs";
import Swerve from "./Swerve";

/**
 * When adding new tabs, just import them here and add them to this array. No other changes are needed.
 */
let allTabs = [Field, Graph, Docs, Swerve];

export default allTabs;
export const displayNames = allTabs.map((tab) => tab.displayName);
