const nodemailer = require("nodemailer");

module.exports.otpMail = async function otpMail(email){

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", 
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "automatenitkkr@gmail.com", // generated gmail user
          pass: "gkxqwgnojmauajso", // generated gmail password
        },
      });

    let subjectM = "OTP Verification";
    let otp =Math.floor((Math.random() * 10000) + 1000);
    let htmlM = `<pre><h2>Your OTP is : ${otp}</h2><h3>With Regards, 
Team Automate</h3></pre>`;



    let info = await transporter.sendMail({
        from : 'Automate "<automatenitkkr@gmail.com>"',
        to : email,
        subject : subjectM,
        html : htmlM
});

    return otp;

}