import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook", "/replicate_webhook", "/api/replicate_webhook"],
});
//ignoredRoutes: ["/((?!api|trpc))(_next|.+\..+)(.*)", "/replicate-webhook"]
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
