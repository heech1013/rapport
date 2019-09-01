const s3Form = (req, res) => {
  const output = `
    <html>
    <body>
      <form enctype='multipart/form-data' method='post' action='http://localhost:5959/s3'>
        <input type='text' name='profileText'>
        <input type='file' name='profileImg' accept='image/*'>
        <input type='submit'>
      </form>
    </body>
    </html>
  `;
  res.send(output);
}

module.exports = s3Form;