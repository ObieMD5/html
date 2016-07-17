module.exports = {
  npm: {
    styles: {
      'skeleton-css': ['css/skeleton.css'],
      'font-awesome': ['css/font-awesome.css']
    }
  },

  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/
      }
    },
    stylesheets: {joinTo: 'app.css'}
  },

  plugins: {
    babel: {presets: ['es2015']}
  },

  server: {
    hostname: process.env.IP,
    port: parseInt(process.env.PORT, 10)
  }
};
