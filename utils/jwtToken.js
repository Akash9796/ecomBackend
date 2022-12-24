//creating token and saving in cookie

const sendToken = async (user, statusCode, res) => {
  const token = await user.getJWTToken();

  //option for cookie
  const options = {
    expires: new Date(new Date().getTime() + 5 * 60 * 1000),
    // expires: new Date(
    //   Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    // ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
