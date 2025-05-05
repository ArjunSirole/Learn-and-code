import axios from "axios";
import readlineSync from "readline-sync";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

async function fetchTumblrData(blogName: string, start: number, end: number) {
  const apiUrl = buildTumblrApiUrl(blogName, start, end);
  try {
    const apiResponseData = await fetchTumblrDataFromUrl(apiUrl);
    return extractTumblrPosts(apiResponseData);
  } catch (error) {
    console.error("Error fetching Tumblr data:", error);
    return null;
  }
}

function buildTumblrApiUrl(
  blogName: string,
  start: number,
  end: number
): string {
  return `https://${blogName}.tumblr.com/api/read/json?type=photo&num=${
    end - start + 1
  }&start=${start - 1}`;
}

async function fetchTumblrDataFromUrl(url: string) {
  const response = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  return response.data;
}

function extractTumblrPosts(apiResponseData: string) {
  const match = apiResponseData.match(/var tumblr_api_read = (\{.*\});/);
  if (!match) {
    console.error("Failed to extract JSON from response.");
    return null;
  }
  return JSON.parse(match[1]);
}

function displayBlogDetails(blogInfo: any, totalPosts: number) {
  const { title, description, name } = blogInfo || {};
  console.log(`| Title: ${title || "No title"}`);
  console.log(`| Name: ${name || "No name"}`);
  console.log(`| Description: ${description || "No description"}`);
  console.log(`| No of Post: ${totalPosts}`);
  console.log("|");
}

function displayImagesFromPostList(posts: any[], startIndex: number) {
  posts.forEach((post, index) => {
    displaySinglePostImageUrls(post, startIndex + index);
  });
}

function displaySinglePostImageUrls(post: any, displayIndex: number) {
  const images = post.photos || [];
  images.forEach((img: any) => {
    const imageUrl = img["photo-url-1280"];
    if (imageUrl) {
      console.log(`| ${displayIndex}. ${imageUrl}`);
    }
  });

  const fallbackUrl = post["photo-url-1280"];
  if (fallbackUrl) {
    console.log(`| ${displayIndex}. ${fallbackUrl}`);
  }
}

function parseRangeInput(range: string): [number | null, number | null] {
  const [startIndex, endIndex] = range.split("-").map(Number);
  return [
    isNaN(startIndex) ? null : startIndex,
    isNaN(endIndex) ? null : endIndex,
  ];
}

function isValidRange(
  startIndex: number | null,
  endIndex: number | null
): boolean {
  return (
    startIndex !== null &&
    endIndex !== null &&
    startIndex >= 1 &&
    endIndex >= startIndex
  );
}

async function fetchTumblrPostsAndDisplayImages() {
  const blogName = getBlogNameFromUser();
  const range = getPostRangeFromUser();

  const [startIndex, endIndex] = parseRangeInput(range);

  if (!isValidRange(startIndex, endIndex)) {
    console.log(
      'Invalid range input. Please ensure the range is in the format "start-end" where start <= end.'
    );
    return;
  }

  const data = await fetchTumblrData(blogName, startIndex!, endIndex!);
  if (data && data.posts) {
    const totalPosts = data["posts-total"];
    displayBlogDetails(data.tumblelog, totalPosts);
    displayImagesFromPostList(data.posts, startIndex!);
  } else {
    console.log("No posts found.");
  }
}

function getBlogNameFromUser(): string {
  return readlineSync.question("Enter the Tumblr blog name: ").trim();
}

function getPostRangeFromUser(): string {
  return readlineSync.question("Enter the range (e.g., 1-5): ").trim();
}

fetchTumblrPostsAndDisplayImages();
