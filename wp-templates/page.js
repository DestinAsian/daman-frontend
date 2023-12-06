import { gql, useQuery } from "@apollo/client";
import * as MENUS from "../constants/menus";
import { BlogInfoFragment } from "../fragments/GeneralSettings";
import { GetMenus } from "../queries/GetMenus";
import {
  Header,
  Footer,
  Main,
  Container,
  ContentWrapper,
  EntryHeader,
  FeaturedImage,
  SEO,
} from "../components";

export default function Page(props) {
  // Loading state for previews
  if (props.loading) {
    return <>Loading...</>;
  }

  const { title: siteTitle, description: siteDescription } =
    props?.data?.generalSettings;
  const { title, content, featuredImage } = props?.data?.page ?? { title: "" };

    // Get menus
    const { data: menusData, loading: menusLoading } = useQuery(GetMenus, {
      variables: {
        primaryLocation: MENUS.PRIMARY_LOCATION,
        secondaryLocation: MENUS.SECONDARY_LOCATION,
        thirdLocation: MENUS.THIRD_LOCATION,
        navigationLocation: MENUS.NAVIGATION_LOCATION,
        footerLocation: MENUS.FOOTER_LOCATION,
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-and-network",
    });
  
    const primaryMenu = menusData?.primaryMenuItems?.nodes ?? [];
    const secondaryMenu = menusData?.secondaryMenuItems?.nodes ?? [];
    const thirdMenu = menusData?.thirdMenuItems?.nodes ?? [];
    const navigationMenu = menusData?.navigationMenuItems?.nodes ?? [];
    const footerMenu = menusData?.footerMenuItems?.nodes ?? [];

  return (
    <>
      <SEO
        title={siteTitle}
        description={siteDescription}
        imageUrl={featuredImage?.node?.sourceUrl}
      />
      <Header
        primaryMenuItems={primaryMenu}
        secondaryMenuItems={secondaryMenu}
        thirdMenuItems={thirdMenu}
        navigationMenuItems={navigationMenu}
        menusLoading={menusLoading}
      />
      <Main>
        <>
          <EntryHeader title={title} image={featuredImage?.node} />
          <>
            <ContentWrapper content={content} menusLoading={menusLoading} />
          </>
        </>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Page.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
  };
};

Page.query = gql`
  ${BlogInfoFragment}
  ${FeaturedImage.fragments.entry}
  query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      ...FeaturedImageFragment
    }
    generalSettings {
      ...BlogInfoFragment
    }
  }
`;
