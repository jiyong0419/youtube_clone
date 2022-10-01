import multer from "multer"; //post된 form에서 file을 받아준다. (req.file)

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
}; // res.locals.변수명 = pug 템플릿으로 변수가 전달됨

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Login First.");
    return res.redirect("/login");
  }
}; //

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatar/", // uploads폴더와 avatar폴더 생성 되고 그안에 file이 저장됨
  limits: {
    fileSize: 150000000, // 업로드 file의 크기를 제한 ( 1000 = 1kb)
  },
});

export const videoUpload = multer({
  dest: "uploads/video/",
  limits: {
    fileSize: 10000000,
  },
});
