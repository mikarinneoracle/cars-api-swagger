<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    <h1>${title}</h1>
    <form method="POST">
        ${hdr_username} <input type="text" name="username" /> <br>
        ${hdr_password} <input type="text" name="password" /> <br>
        <input type="submit" value="${hdr_create_btn}" />
    </form>
  </body>
</html>