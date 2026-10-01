export const sendEmailVerifyTemplate = (data: string) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Hello, World!</title>
    <!-- <link rel="stylesheet" href="styles.css" /> -->
    <style type="text/css" media="all">
      body {font-family: sans; background-color: #FDFBF7;}
      .submit {background-color: blue; border: blue; color: white; padding:4px 8px; border-radius:5px;}
    </style>
  </head>
  <body>
      <p class="newTitle">
Terima kasih telah mendaftar. Silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini.
Verifikasi Email
</p>
<a href="${process.env.BASE_URL}/auth/email-verify?token=${data}" target="_blank">
  <button class="submit">Verify Email</button>
</a>
<p>Jika Anda tidak merasa melakukan pendaftaran, abaikan email ini.</p>
      <!-- <script src="script.js"></script> -->
  </body>
</html>`;
};
