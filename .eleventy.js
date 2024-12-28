const sitemap = require('@quasibit/eleventy-plugin-sitemap');
const htmlmin = require('html-minifier-terser');
const fs = require('fs');
const { execSync } = require('child_process');
const CleanCSS = require('clean-css');

function minifyJsonLd(content) {
  return content.replace(
    /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,
    (_, openTag, jsonContent, closeTag) => {
      const minifiedJson = JSON.stringify(JSON.parse(jsonContent));
      return `${openTag}${minifiedJson}${closeTag}`;
    }
  );
}

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

  // Minify HTML output
  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      content = minifyJsonLd(content);
      let minified = htmlmin.minify(content, {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        minifyJS: true,
        minifyCSS: true,
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addFilter('cssmin', function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Run pagefind after build
  eleventyConfig.on('eleventy.after', () => {
    execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' });
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
