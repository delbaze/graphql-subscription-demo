import Book from "../../models/Book";
import getFieldNames from "graphql-list-fields";
import { selectFromFields } from "../../lib/utilities";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
const NEW_BOOK_ADDED = "new-book-added";
export default {
  Query: {
    listBooks: async (_, {}, ctx, infos) => {
      const fields = getFieldNames(infos);
      const books = await Book.find({}).select(selectFromFields(fields)); // par ex {name: 1, birthday: 1}
      return books;
    },
  },
  Mutation: {
    addBook: (_, { addBookInput }) => {
      const newBook =  Book.create({ ...addBookInput })
      pubsub.publish(NEW_BOOK_ADDED, {
        bookAdded: newBook,
      })
      return newBook;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => {
        console.log("Nouveau client en attente de publication!");
        return pubsub.asyncIterator(NEW_BOOK_ADDED);
      },
    },
  },
};
