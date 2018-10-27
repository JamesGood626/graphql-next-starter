import React, { Component } from "react";
import fetch from "node-fetch";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { withClientState } from "apollo-link-state";
import { ApolloProvider } from "react-apollo";

//const zomatoKey = process.env.ZOMATO_KEY || zomatoAPIKey;
//const mapKey = process.env.GOOGLE_MAPS_KEY || googleAPIKey;

const cache = new InMemoryCache();
const zomatoGraphQLAPI = new HttpLink({
  uri: "/graphql",
  fetch: fetch
  // headers: { zomatoKey, mapKey }
});

const defaultState = {
  // mapPosition: {
  //   __typename: "MapPosition",
  //   latitude: null,
  //   longitude: null
  // }
};

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: {
      updateSearchParameters: (_, { input }, { cache }) => {
        const { index, value } = input;
        const query = gql`
          query GetSearchParameters {
            searchParameters @client {
              __typename
              categories
              cuisines
              establishment
              radius
            }
          }
        `;
        const previousState = cache.readQuery({ query });
        const data = {
          ...previousState,
          searchParameters: {
            ...previousState.searchParameters,
            [index]: value
          }
        };
        cache.writeData({ query, data });
      }
    }
  }
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, zomatoGraphQLAPI])
});

class ApolloContainer extends Component {
  render() {
    return (
      <ApolloProvider client={client}>{this.props.children}</ApolloProvider>
    );
  }
}

export default ApolloContainer;
