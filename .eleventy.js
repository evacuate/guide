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

  eleventyConfig.on('afterBuild', () => {
    const CleanCSS = require('clean-css');
    const fs = require('fs');

    // Run me after the build ends
    var inputFile = 'src/assets/css/style.css';
    var input = fs.readFileSync(inputFile, 'utf8');
    var output = new CleanCSS().minify(input);
    fs.writeFile('_site/assets/css/style.css', output.styles, function (err) {
      if (err) return console.log('Error minifying style.css' + err);
    });
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
