const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const PORT = 8080;

async function translate(text, lang) {
  const data = (Array.isArray(text) ? text.slice(0, 100) : [text])
    .map((x) => ({ Text: x.substring(0, 100) }));
  const url = 'https://api.cognitive.microsofttranslator.com/translate';
  const resp = await axios.post(url, data, {
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.TRANSLATE_KEY,
      'Ocp-Apim-Subscription-Region': process.env.TRANSLATE_REGION,
    },
    params: {
      'api-version': '3.0',
      to: lang,
    },
  });

  return resp.data.map((x) => x.translations[0].text);
}

// start a web server
express()
  .post('/', bodyParser.json({ limit: '100mb' }), async (req, res, next) => {

    try {
      console.log(`Processing ${req.body.values.length} records`);

      const lang = req.headers['accept-language'] || 'en';
      const translated = await translate(req.body.values.map((x) => x.data.text), lang);
      for (let i = 0; i < req.body.values.length; i += 1) {
        req.body.values[i].data.text = translated[i];
      }

      console.dir(req.body.values, { depth: 10 });

      res.status(200).json(req.body);

    } catch (err) {
      next(err);
    }


  })
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));

