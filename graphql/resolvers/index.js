import authorResolver from "./author.resolver";
import bookResolver from "./book.resolver";
import { mergeResolvers } from "@graphql-tools/merge";

export default mergeResolvers([authorResolver, bookResolver]);
