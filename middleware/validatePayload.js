module.exports = (validateFn) => {
  return (req, res, next) => {
    const { error } = validateFn(req.body);

    if ( error ) {
      let feedback = '';

      for ( const err of error.details ) {
        feedback += `${err.message}\n`;
      }

      return res.status(400).send(feedback);
    }

    next();
  };
};