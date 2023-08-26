import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook", "/replicate-webhook", "/api/replicate-webhook"],
});
//ignoredRoutes: ["/((?!api|trpc))(_next|.+\..+)(.*)", "/replicate-webhook"]
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  ignoredRoutes: ["/((?!api|trpc))(_next|.+\..+)(.*)", "/api/replicate-webhook"]

};
