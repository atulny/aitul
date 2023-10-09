/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "googleusercontent.com",
      "oaidalleapiprodscus.blob.core.windows.net",
      "cdn.openai.com"
    ]
  },
}
const removeImports = require("next-remove-imports")();
const remove_exports = removeImports({
  experimental: { esmExternals: true }
});
const exp = Object.assign({},nextConfig,remove_exports)
module.exports = exp
