import Author from "../../models/Author";
import Book from "../../models/Book";
import getFieldNames from "graphql-list-fields";
import { throwHttpGraphQLError } from "apollo-server-core/dist/runHttpQuery";

import { selectFromFields } from "../../lib/utilities";
export default {
  Query: {
    listAuthors: async (_, {}, ctx, infos) => {
      const fields = getFieldNames(infos);
      const authors = await Author.find({})
        // .select(selectFromFields(fields)) // {name: 1, _id: 1, books: 1}
        // .select({ name: 1, _id: 1, books: 1 }) // {name: 1, _id: 1}
        .populate("books")
        .exec(); // par ex {name: 1, birthday: 1}
      return authors;
    },
  },
  Mutation: {
    addAuthor: async (_, { addAuthorInput }) => {
      const { name, birthday } = addAuthorInput;
      const author = await Author.create({ name, birthday });

      return author;
    },
    assignBook: async (_, { assignBookInput }) => {
      const { author_id, book_id } = assignBookInput;

      let errors = [];
      let author = await Author.findOne({ _id: author_id });
      let book = await Book.findOne({ _id: book_id });

      if (!author) {
        errors.push("L'auteur n'existe pas");
        // throwHttpGraphQLError(404, ["L'auteur n'existe pas"]);
        // throw new Error("L'auteur n'existe pas")
      }
      if (!book) {
        errors.push("Le bouquin n'existe pas");
        // throwHttpGraphQLError(404, ["Le bouquin n'existe pas"]);
        // throw new Error("L'auteur n'existe pas")
      }
      if (errors.length > 0) {
        throwHttpGraphQLError(404, errors);
      }

      author.books.some((b) => b._id == book_id)
        ? throwHttpGraphQLError(403, "Livre déjà assigné")
        : author.books.push(book_id);

      author.save();

      return author;
    },
  },
};
