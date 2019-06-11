#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const nrc = require('node-run-cmd');


function clean(){
  var commands = [
    'rm -rf dist'
  ];

  var options = { cwd: process.cwd() };
  return nrc.run(commands, options);
}


function expoExport(){
  const package = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'UTF-8'));
  let homepage = package.homepage;
  if(homepage.charAt(homepage.length -1) === '/'){
    homepage = homepage.slice(0, -1);
  }
  var commands = [
    `expo export --public-url ${homepage}`,
  ];

  var options = { cwd: process.cwd() };
  return nrc.run(commands, options);
}

async function createPage(codes){
    const package = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'UTF-8'));
    let homepage = package.homepage;
    if(homepage.charAt(homepage.length -1) === '/'){
      homepage = homepage.slice(0, -1);
    }
    let exphomepage = homepage.replace('http', 'exp');
    const androidIndexJsonURI = `${exphomepage}/android-index.json`;
    const iosIndexJsonURI = `${exphomepage}/ios-index.json`;
  
    const androidQrCode = await qrcode.toDataURL(androidIndexJsonURI);
    const iosQrCode = await qrcode.toDataURL(iosIndexJsonURI);
    fs.writeFileSync('./dist/favicon.ico', require('./favicon.ico'))
    fs.writeFileSync('./dist/index.html',
`<!DOCTYPE html>
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"
        integrity="sha256-vK3UTo/8wHbaUn+dTQD0X6dzidqc5l7gczvH+Bnowwk=" crossorigin="anonymous" />
    <meta charset="UTF-8">
    <title>expo-gh-pages</title>
</head>

<body>
    <div class="bd-example">
        <section class="hero is-medium is-dark is-bold">
            <div class="hero-body">
                <div class="container">
                    <p class="title">
                        ${homepage}
                    </p>

                    <p class="subtitle">
                        Download Expo
                    </p>
                    <a href="https://itunes.apple.com/br/app/expo-client/id982107779?mt=8">
                        <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABQCAYAAAD2i6slAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEMyMENDQjkyOTZBMTFFOEJCNzFERUQ5MDI3OUJCRUUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEMyMENDQkEyOTZBMTFFOEJCNzFERUQ5MDI3OUJCRUUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QzIwQ0NCNzI5NkExMUU4QkI3MURFRDkwMjc5QkJFRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QzIwQ0NCODI5NkExMUU4QkI3MURFRDkwMjc5QkJFRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv8Mvj8AABv0SURBVHja7J0JuFXT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" />
                    </a>
                    <a href="https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pt_BR">
                        <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABQCAYAAAD2i6slAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzI5MzM0MTAyOTZBMTFFOEJERjVCODA0QTk1MTIzQjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzI5MzM0MTEyOTZBMTFFOEJERjVCODA0QTk1MTIzQjUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMjkzMzQwRTI5NkExMUU4QkRGNUI4MDRBOTUxMjNCNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMjkzMzQwRjI5NkExMUU4QkRGNUI4MDRBOTUxMjNCNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkXcM04AACM8SURBVHja7J0JnBPl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" />
                    </a>
                </div>
            </div>
        </section>
    </div>
    <hr />
    <div class="container">
        <div class="columns">
            <div class="column has-text-centered">
                <a class="is-size-2" href="${androidIndexJsonURI}">Android link</a>
                <img src="${androidQrCode}" style="display: block;
          margin-left: auto;
          margin-right: auto;" />
            </div>
            <div class="column has-text-centered">
                <a class="is-size-2" href="${iosIndexJsonURI}">iOS link</a>
                <img src="${iosQrCode}" style="display: block;
          margin-left: auto;
          margin-right: auto;" />
            </div>
        </div>
    </div>
    <footer class="footer">
        <div class="content has-text-centered">
            <p>
                <strong>expo-gh-pages</strong> by <a href="https://zephyrplace.com">Zephyr Place</a>.<br><a
                    href="https://github.com/zephyrplace/expo-gh-pages"><img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAABL1BMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+wWhOAAAAZHRSTlMA9E78GRtR/fIda+9s17cu+50cFm0+B7ZzIvr3Ggj4VSTT2BQ48bOZnjwDrfUX4GkM+ZyhPwFJ7rVT2TmqCk2aQiNWslDBQAI634IloB8OBkZuCaPOn/a9fJukZusSX+VFT/6wpTWrpgAAAS1JREFUKM+9k9diwjAMRZ2QxiFhFtoyCnTvvTdtoXvvvf3/31DJVRKb8oxeontPIku2w1hrIhpLxA0jnnDbm8C24ZSg4BtnjdR0hBLOlk6zXGjBsypdioiG4KayLlYeSKYJpZOHUL87wHNodjJmL2TGMvt1xkqgq8FEsnSPstgJ6JQ/X0yWHFVwBxouiS4U49okNXBWKF9DvK5h/LyPcoc6U2IG94ZyA/G5hvvBmaD8CLGp4VVwptTWbq8VutkLzhCJnBzsIdym6B4aOV8VJL+/q+RB5XdPiygLlv/2jRDvP+AUL0Fsl/92fj48Ek+8vj2XvUepjiUdtMJWKly8BGJHHqitDuJ+f3yWKD9AOq1fly8PTMqFWLb/XcWniI9nRyab3FXr6kI+F60W/Tm/VZNajz5/ZM8AAAAASUVORK5CYII="></a>
            </p>
        </div>
    </footer>
</body>

</html>`);
}

function publish() {  
  var commands = [
    'gh-pages -d dist'
  ];

  var options = { cwd: process.cwd() };
  return nrc.run(commands, options);
}

function main(args) {
  return clean()
  .then(expoExport)
  .then(createPage)
  .then(publish)
}

if (require.main === module) {
  main(process.argv)
    .then(() => {
      process.stdout.write('Published\n');
    })
    .catch(err => {
      process.stderr.write(`${err.message}\n`, () => process.exit(1));
    });
}

exports = module.exports = main;