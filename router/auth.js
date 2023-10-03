const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      res.redirect('/login');
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.redirect('/login');
      }
      req.user = decoded;
      next();
    });
  };

  export default authenticate;