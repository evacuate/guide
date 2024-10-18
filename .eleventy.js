const sitemap = require('@quasibit/eleventy-plugin-sitemap');
const htmlmin = require('html-minifier-terser');
const fs = require('fs');

module.exports = (eleventyConfig) => {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy('src/assets');

  const hostname = 'https://evacuate.github.io/';

  // Add sitemap plugin
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: hostname,
    },
  });

  eleventyConfig.on('afterBuild', () => {
    //Replace url in Sitemap
    const sitemap = fs.readFileSync('_site/sitemap.xml', 'utf8');
    const sitemapWithHostname = sitemap.replace(/https:\/\/evacuate.github.io\//g, hostname + 'guide/');
    fs.writeFileSync('_site/sitemap.xml', sitemapWithHostname);
  });

  eleventyConfig.on('afterBuild', () => {
    const CleanCSS = require('clean-css');

    // Run me after the build ends
    var inputFile = 'src/assets/css/style.css';
    var input = fs.readFileSync(inputFile, 'utf8');
    var output = new CleanCSS().minify(input);
    fs.writeFile('_site/assets/css/style.css', output.styles, function (err) {
      if (err) return console.log('Error minifying style.css' + err);
    });
  });

  // Minify HTML output
  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      let minified = htmlmin.minify(content, {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
      });
      return minified;
    }

    return content;
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
