module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ["browserify", "mocha","sinon-chai"],
        files: [
            './app/scripts/**/*.js',
            './app/scripts/**/*.jsx',
            'test/client/**/*test.js',
        ],
        exclude: ['./app/scripts/app.jsx'],
        preprocessors: {
          "./app/scripts/**/*.js": ["browserify"],
          "./app/scripts/**/*.jsx": ["browserify"],
          'test/client/**/*test.js' : [ "browserify"]
        },

        browserify: {
          debug: true,
          configure: function(bundle) {
              bundle.exclude('react/lib/ReactContext');
              bundle.exclude('react/lib/ExecutionEnvironment');
          },
          transform: [
            [
              'babelify',
              {
                presets: ["es2015", "react"]
              }
            ], [
              'browserify-istanbul',
              {
                instrumenterConfig: {
                  embedSource: true
                }
              }
            ]
          ]
        },

        plugins: [
            'karma-less-preprocessor',
            'karma-browserify',
            'karma-coverage',
            'karma-mocha',
            'karma-requirejs',
            'karma-sinon-chai',
            'karma-chrome-launcher'
        ],

        reporters: ['progress', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        coverageReporter: {
            dir: 'coverage/',
            reporters: [{
                type: 'html',
                subdir: 'html'
            }, {
                type: 'lcovonly',
                subdir: 'lcov'
            }, {
                type: 'json',
                subdir: 'json'
            }]
        }
    });
};
