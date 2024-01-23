import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';
import { useState } from 'react';

import {SearchForm, SearchResults, NoSearchResults} from '~/components/Search';
import SearchFilter from "~/components/SearchFilter"


export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Search`}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const searchTerm = String(searchParams.get('q') || '');
  const vendorFilter = String(searchParams.get('vendor') || '');
  const ExclusiveFilter = String(searchParams.get('Exclusive') || '');
  const CollectionFilter = String(searchParams.get('Collection') || '');
  const typeFilter = String(searchParams.get('type') || '');


  const productFilters: any[] = [];

  if (!searchTerm) {
    return {
      searchResults: {results: null, totalResults: 0},
      searchTerm,
    };
  }

  const combinedFilters: {productVendor?: string; productType?: string; productExclusive?: string; Collection?: string;}[] = [];

  if (vendorFilter) {
    const vendors = vendorFilter.split('|');
    vendors.forEach((vendor) => {
      combinedFilters.push({productVendor: vendor});
    });
  }

  if (typeFilter) {
    const types = typeFilter.split('|');
    types.forEach((type) => {
      combinedFilters.push({productType: type});
    });
  }

  if (ExclusiveFilter) {
    const Exclusives = ExclusiveFilter.split('|');
    Exclusives.forEach((Exclusive) => {
      combinedFilters.push({productExclusive: Exclusive});
    });
  }

  if (CollectionFilter) {
    const Collections = CollectionFilter.split('|');
    Collections.forEach((Collectionz) => {
      combinedFilters.push({Collection: Collectionz});
    });
  }

  const data = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      query: searchTerm,
      productFilters: combinedFilters.length > 0 ? combinedFilters : null,
      ...variables,
    },
  });

  if (!data) {
    throw new Error('No search data returned from Shopify API');
  }

  const totalResults = Object.values(data).reduce((total, value: any) => {
    return total + value.nodes.length;
  }, 0);

  const searchResults = {
    results: data,
    totalResults,
  };

  return defer({searchTerm, searchResults});
}
export default function SearchPage() {
  const { searchTerm, searchResults } = useLoaderData<typeof loader>();
  const [appliedFilters, setAppliedFilters] = useState({
    vendor: [],
    type: [],
    Exclusive: [],
    Collection: [],
    // Availability: [],
  });

  const handleFilterChange = (
    filterName: string,
    value: string,
    isChecked: boolean,
    updatedFilters: string[]
  ) => {
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: updatedFilters,
    }));

  };


  const totalProducts = searchResults.results?.products?.nodes.length || 0;
  const totalArticles = searchResults.results?.articles?.nodes.length || 0;

  return (
    <div className="search-page">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '30px', border: '1px solid #ccc', width: '150vh',marginBottom: '10px', }}>

      {/* Top row: Search Box */}
      <div className="top-row" style={{ marginTop: '50px' }}>
        <SearchForm searchTerm={searchTerm} showSearchButton={true} value1={totalProducts} value2={totalArticles}/>
      </div>
      {/* Bottom row: Search Results */}
      <div className="bottom-row" style={{ border: '1px solid #ccc', padding: '10px', width: '150vh', background: '#f0f0f0' }}>
        {!searchTerm || !searchResults.totalResults ? (
          <NoSearchResults />
        ) : (
          <SearchResults results={searchResults.results} />
        )}
      </div>
      </div>
    </div>

  );
}


const SEARCH_QUERY = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    variants(first: 1) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        product {
          handle
          title
        }
      }
    }
  }
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
  query search(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $query: String!
    $startCursor: String
    $productFilters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $query,
      unavailableProducts: HIDE,
      types: [PRODUCT],
      first: $first,
      sortKey: RELEVANCE,
      last: $last,
      before: $startCursor,
      after: $endCursor
      productFilters: $productFilters
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    pages: search(
      query: $query,
      types: [PAGE],
      first: 10
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    articles: search(
      query: $query,
      types: [ARTICLE],
      first: 10
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
  }
` as const;