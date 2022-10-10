const path = require("path"); // import 구식버전
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // scss에서 css로 변환된 파일을 따로 저장해준다. 그냥써

const BASE_JS = "./src/client/js/";

// export 구식버전
module.exports = {
  // entry : webpack에게 전달할 파일 경로
  entry: {
    main: `${BASE_JS}main.js`,
    videoPlayer: `${BASE_JS}videoPlayer.js`,
    recorder: `${BASE_JS}recorder.js`,
    commentSection: `${BASE_JS}commentSection.js`,
  },
  // mode: webpack에게 아직 개발중인지, 완성품인지 알려줌
  // mode: "development",   >> package.json에서 command를 이용하여 실행했다
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
  ],
  // watch : webpack 수정시 자동실행
  // watch: true,  >> package.json에서 command를 이용하여 실행했다
  // output : webpack을 거쳐 변환된 파일을 저장하는것에 대한 설정
  output: {
    // [name]에는 entry의 property를 webpack이 넣어준다
    filename: "js/[name].js",
    // path : webpack이 변환한 파일의 저장경로
    // path.resolve()는 ()안의 모든 인자들을 하나의 경로로 합쳐준다
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  // module : webpack이 사용할 loader들
  module: {
    // rules : loader들 세부설정하는곳
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
