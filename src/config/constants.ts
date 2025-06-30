export const AUTO_HIDE_THRESHOLD = 5;

export const ADMIN_MENU_CHOICES = [
  { name: "1. View external servers", value: "servers" },
  { name: "2. View server details", value: "serverDetails" },
  { name: "3. Update server API key", value: "updateApiKey" },
  { name: "4. Add news category", value: "addCategory" },
  { name: "5. Delete user", value: "deleteUser" },
  { name: "6. Deactivate user", value: "deactivateUser" },
  { name: "7. Reactivate user", value: "reactivateUser" },
  { name: "8. Change user role", value: "changeUserRole" },
  { name: "9. View user metrics", value: "userMetrics" },
  { name: "10. Review Reported Articles", value: "reviewReports" },
  { name: "11. Logout", value: "logout" },
];

export const USER_MENU_CHOICES = [
  "1. Headlines",
  "2. Saved Articles",
  "3. Search",
  "4. Notifications",
  "5. Logout",
];

export const HEADLINES_MENU_CHOICES = ["1. Today", "2. Date Range", "3. Back"];

export const SAVED_ARTICLES_MENU_CHOICES = [
  "1. View All Saved Articles",
  "2. Like/Dislike a Saved Article",
  "3. View Liked Articles",
  "4. View Disliked Articles",
  "5. Delete a Saved Article",
  "6. Report an Article",
  "7. Back",
];

export const FEEDBACK_CHOICES = ["LIKE", "DISLIKE"];

export const SEARCH_CATEGORY_CHOICES = [
  "Skip",
  "Business",
  "Entertainment",
  "Sports",
  "Technology",
];

export const SEARCH_SORT_CHOICES = ["Relevance", "Date", "Like", "Dislike"];
