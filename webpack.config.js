const path = require("path"); // import 구식버전
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// export 구식버전
module.exports = {
  entry: "./src/client/js/main.js", // entry : webpack에게 전달할 파일 경로
  mode: "development", // mode: webpack에게 아직 개발중인지, 완성품인지 알려줌
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
  ],
  watch: true, // webpack
  output: {
    filename: "js/main.js", //
    path: path.resolve(__dirname, "assets"), // path : webpack이 반환할 파일명과 경로
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};

/*client 폴더 안의 js는 우리가 작성할 프론트 js고
  assets 폴더 안의 js는 브라우저가 확인할 프론트 js다
  */
