import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import FeaturedCards from '~/components/FeaturedCards';

import type {
  // FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import Carousel from '~/components/Carousel';
import FeaturedCollections from '~/components/FeaturedCollections';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  // const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  // const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({/*featuredCollection,*/ recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Carousel />
      {/* <FeaturedCollection collection={data.featuredCollection} /> */}
      <FeaturedCollections storefrontAccessToken={''} domain={''} />
      <FeaturedCards />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

// function FeaturedCollection({
//   collection,
// }: {
//   collection: FeaturedCollectionFragment;
// }) {
//   if (!collection) return null;
//   const image = collection?.image;
//   return (
//     <Link
//       className="featured-collection"
//       to={`/collections/${collection.handle}`}
//     >
//       {image && (
//         <div className="featured-collection-image">
//           <Image data={image} sizes="100vw" />
//         </div>
//       )}
//       <h1>{collection.title}</h1>
//     </Link>
//   );
// }

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

// Define a GraphQL query to fetch a featured collection from Shopify
// const FEATURED_COLLECTION_QUERY = `#graphql
//   # This is a GraphQL fragment for common fields of a collection
//   fragment FeaturedCollection on Collection {
//     id        # The unique identifier of the collection
//     title     # The title of the collection
//     image {   # The image object associated with the collection
//       id      # Image's unique identifier
//       url     # URL of the collection image
//       altText # Alternative text for the image
//       width   # Width of the image
//       height  # Height of the image
//     }
//     handle    # The handle (URL-friendly identifier) of the collection
//   }

//   # Main query to fetch the featured collection
//   query FeaturedCollection($country: CountryCode, $language: LanguageCode)
//     @inContext(country: $country, language: $language) {
//     collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
//       nodes {
//         ...FeaturedCollection
//       }
//     }
//   }
// ` as const; // 'as const' ensures the query is treated as a constant in TypeScript

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;