import Link from "next/link";
import Image from "next/image";
import React from "react";
import classNames from "classnames/bind";
import styles from "./DamanTv.module.scss";
import { GetDamanTv } from "../../../queries/GetDamanTv";
import { useQuery } from "@apollo/client";
import { Swiper, SwiperSlide } from "swiper/react";

let cx = classNames.bind(styles);

export default function DamanTv({ damanTvLogo }) {
  const videosPerPage = 6;

  // Get DAMAN TV Videos
  const { data } = useQuery(GetDamanTv, {
    variables: {
      // DAMAN TV category id
      id: 12290,
      first: videosPerPage,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
  });

  // First Post
  const latestDamanTv = data?.category?.contentNodes?.edges[0];
  // Other Post
  const otherDamanTv = (data?.category?.contentNodes?.edges ?? []).slice(1);

  const extractYouTubeVideoId = (embedUrl) => {
    const match = embedUrl.match(/\/embed\/([^/"]+)/);
    return match ? match[1] : null;
  };

  return (
    <>
      <div className={cx("component")}>
        {latestDamanTv && (
          <div className={cx("first-wrapper")}>
            <div className={cx("first-video-wrapper")}>
              {damanTvLogo && (
                <div className={cx("daman-tv-logo-wrapper")}>
                  <Link
                    href={latestDamanTv?.node?.categories?.edges[0]?.node?.uri}
                  >
                    <Image
                      src={damanTvLogo?.sourceUrl}
                      altText={damanTvLogo?.altText}
                      className={cx("daman-tv-logo")}
                      fill
                      sizes="100%"
                    />
                  </Link>
                </div>
              )}
              {latestDamanTv?.node?.content && (
                <div className={cx("first-iframe-wrapper")}>
                  <iframe
                    src={
                      "https://www.youtube.com/embed/" +
                      extractYouTubeVideoId(latestDamanTv?.node?.content)
                    }
                    title={latestDamanTv?.node?.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              {latestDamanTv?.node?.title && (
                <div className={cx("first-title-wrapper")}>
                  <Link href={latestDamanTv?.node?.uri}>
                    <h2>{latestDamanTv?.node?.title}</h2>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        <div className={cx("other-wrapper")}>
          <Swiper
            slidesPerView={1.5}
            spaceBetween={16}
            breakpoints={{
              640: {
                slidesPerView: 3.5,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4.5,
                spaceBetween: 24,
              },
            }}
            className="daman-tv-swiper"
          >
            {otherDamanTv.map((post, index) => (
              <SwiperSlide key={index}>
                <div className={cx("other-video-wrapper")}>
                  {post?.node?.content && (
                    <Link href={post?.node?.uri}>
                      <div className={cx("other-image-wrapper")}>
                        <Image
                          src={post?.node?.featuredImage?.node?.sourceUrl}
                          alt={post?.node?.featuredImage?.node?.altText}
                          fill
                          sizes="100%"
                        ></Image>
                      </div>
                    </Link>
                  )}
                  {post?.node?.title && (
                    <div className={cx("other-title-wrapper")}>
                      <Link href={post?.node?.uri}>
                        <h2>{post?.node?.title}</h2>
                      </Link>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}
