import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./Features.module.scss";
import { GetFeatures } from "../../../queries/GetFeatures";
import { useQuery } from "@apollo/client";

let cx = classNames.bind(styles);

import Image from "next/image";

export default function Features({}) {
  const postsPerPage = 6;

  // Get Feature Posts
  const { data } = useQuery(GetFeatures, {
    variables: {
      // Feature category id
      id: 4,
      first: postsPerPage,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
  });

  const featurePosts = data?.category?.contentNodes?.edges ?? [];

  const calculateTrimmedExcerpt = (excerpt) => {
    const MAX_EXCERPT_LENGTH = 150; // You can adjust this value according to your needs

    let trimmedExcerpt = excerpt?.substring(0, MAX_EXCERPT_LENGTH);
    const lastSpaceIndex = trimmedExcerpt?.lastIndexOf(" ");

    if (lastSpaceIndex !== -1) {
      trimmedExcerpt = trimmedExcerpt?.substring(0, lastSpaceIndex) + "...";
    }

    return `${trimmedExcerpt}`;
  };

  return (
    <>
      <div className={cx("component")}>
        <div className={cx("title-wrapper")}>
          {data?.category?.uri && data?.category?.name && (
            <Link href={data?.category?.uri}>
              <div className={cx("title")}>{data?.category?.name}</div>
            </Link>
          )}
        </div>
        {featurePosts.map((post) => (
          <div className={cx("post-wrapper")}>
            {post?.node?.featuredImage && (
              <div className={cx("post-image-wrapper")}>
                <Link href={post?.node?.uri}>
                  <Image
                    src={post?.node?.featuredImage?.node?.sourceUrl}
                    className={cx("featured-image")}
                    fill
                    sizes="100%"
                  />
                </Link>
              </div>
            )}
            {post?.node?.categories?.edges[0] && (
              <div className={cx("post-category-wrapper")}>
                <Link href={post?.node?.categories?.edges[0]?.node?.uri}>
                  <h2>
                    {post?.node?.categories?.edges[0]?.node?.parent?.node?.name}
                    {" | "}
                    {post?.node?.categories?.edges[0]?.node?.name}
                  </h2>
                </Link>
              </div>
            )}
            {post?.node?.title && (
              <div className={cx("post-title-wrapper")}>
                <Link href={post?.node?.uri}>
                  <h2>{post?.node?.title}</h2>
                </Link>
              </div>
            )}
            {post?.node?.excerpt && (
              <div className={cx("post-excerpt-wrapper")}>
                <Link href={post?.node?.uri}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: calculateTrimmedExcerpt(post?.node?.excerpt),
                    }}
                  />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}