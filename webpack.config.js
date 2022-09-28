const path = require("path"); // import 구식버전
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// export 구식버전
module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
    recorder: "./src/client/js/recorder.js",
  }, // entry : webpack에게 전달할 파일 경로
  mode: "development", // mode: webpack에게 아직 개발중인지, 완성품인지 알려줌
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
  ],
  watch: true, // webpack자동실행
  output: {
    filename: "js/[name].js", // webpack이 알아서 [name]에 entry의 프로퍼티를 집어넣어준다.
    path: path.resolve(__dirname, "assets"), // path.resolve()는 여러 인자를 넣으면 하나의 경로로 합쳐준다, path : webpack이 반환할 파일명과 경로
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/, // js로 끝나는 파일에 loader를 적용한다
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/, // scss로 끝나는 파일에 loader를 적용한다
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};

/*client 폴더 안의 js는 우리가 작성할 프론트 js고
  assets 폴더 안의 js는 브라우저가 확인할 프론트 js다
  */
