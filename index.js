const express = require('express');
const bodyParser = require('body-parser');

const PORT = 8080;

// start a web server
express()
	.post('/', bodyParser.json(), (req, res, next) => {

    // process each documet in the input array
    const processed = req.data.values.map((doc) => {
      const {
        recordId,
        data: {
          isAdult,
          startYear,
          endYear,
          runtimeMinutes,
          genres } } = doc;

      // cleanup bools, numbers, and arrays
      isAdult = isAdult === '1';
      startYear = parseInt(startYear) || -1;
      endYear = parseInt(endYear) || -1;
      runtimeMinutes = parseInt(runtimeMinutes) || -1;
      genres = genres.split(',');

      // output record may include errorrs or warnings
      return {
        recordId,
        data: { isAdult, startYear, endYear, runtimeMinutes, genres },
        warnings: null,
        errors: null,
      };
    });

    // return the processed content
    res.status(200).json(processed);

  })
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));

