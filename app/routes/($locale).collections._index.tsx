import {useLoaderData, Link} from '@remix-run/react'; // useLoaderData for fetching data, Link for navigation
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen'; // json for server response, LoaderFunctionArgs for typing loader arguments
import {Pagination, getPaginationVariables, Image} from '@shopify/hydrogen'; // Components and utility from Hydrogen
import type {CollectionFragment} from 'storefrontapi.generated'; // TypeScript type for CollectionFragment

// Server-side loader function to fetch data
export async function loader({context, request}: LoaderFunctionArgs) {
  // Get pagination variables from the request
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 100, // Number of items per page
  });

  // Fetch collections data using the GraphQL query and pagination variables
  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  // Return the fetched data as JSON
  return json({collections});
}

// React component to display collections
export default function Collections() {
  // Fetch collections data loaded by the loader function
  const {collections} = useLoaderData<typeof loader>();

  // Render the collections with Pagination
  return (
    <div className="collections">
      <h1>Collections</h1>
      <Pagination connection={collections}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            <CollectionsGrid collections={nodes} />
            <NextLink>
              {isLoading ? 'Loading...' : <span>Load more ↓</span>}
            </NextLink>
          </div>
        )}
      </Pagination>
    </div>
  );
}

// Component to render a grid of collections
function CollectionsGrid({collections}: {collections: CollectionFragment[]}) {
  return (
    <div className="collections-grid">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

// Component to render a single collection item
function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="collection-item"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
        />
      )}
      <h5>{collection.title}</h5>
    </Link>
  );
}

// GraphQL query for fetching collections
const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const; // Marking the query as a constant