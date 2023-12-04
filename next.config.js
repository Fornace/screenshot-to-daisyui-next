/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

// const removeImports = require('next-remove-imports')({
//   test: /node_modules\/codemirror\/.*?\/codemirror\.css$/,
//   // matchImports: "\\.(less|css|scss|sass|styl)$"
// });
