const sitemap = require('eleventy-plugin-sitemap');

module.exports = (eleventyConfig) => {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy('src/assets');

  // Add sitemap plugin
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: 'https://yourdomain.com', // Replace with your domain
    },
  });

  // Define directories
  return {
    dir: {
      input: 'src',
      output: '_site',
      layouts: 'layouts',
      includes: 'includes',
      data: 'data',
    },
    passthroughFileCopy: true,
  };
};
