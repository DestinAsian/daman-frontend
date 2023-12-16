import className from "classnames/bind";
import { Heading, PostInfo, FeaturedImage, BorderDivider } from "../../components";
import styles from "./EntryHeader.module.scss";

let cx = className.bind(styles);

export default function EntryHeader({ title, image, date, author, className }) {
  const hasText = title || date || author;

  return (
    <div className={cx(["component", className])}>
      <BorderDivider />
      {image && (
        <FeaturedImage image={image} className={cx("image")} priority />
      )}

      {hasText && (
        <div className={cx("text", { "has-image": image })}>
          <>
            {!!title && <Heading className={cx("title")}>{title}</Heading>}
            <PostInfo className={cx("byline")} author={author} date={date} />
          </>
        </div>
      )}
    </div>
  );
}
