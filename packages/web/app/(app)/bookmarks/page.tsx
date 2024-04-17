import { SavedTweets } from "@/components/saved-tweets";

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  //  const res = await client.api.posts[":id"].$get({
  //    param: {
  //      id: "123",
  //    },
  //  });
  //   if (res.ok) {
  //     const data = await res.json();
  //     console.log(data.body);
  //   }

  return (
    <div className="container relative">
      <div className="relative flex h-full w-full">
        {/* Loop through the tweets and render them */}
        <div className="mt-8 flex w-full p-6">
          <SavedTweets
            params={{
              search:
                typeof searchParams.search === "string"
                  ? searchParams.search
                  : undefined,
              limit: 10,
              page:
                typeof searchParams.page === "string"
                  ? parseInt(searchParams.page)
                  : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}
