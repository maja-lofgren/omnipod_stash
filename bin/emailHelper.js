function sendEmail(CountLeft, Typ) {
    console.log("You are running low on " + Typ + "s!!! \n Notify owner to get more!");
    var nodemailer = require('nodemailer');

    let from = process.env.FROM + '@gmail.com'
    let to = process.env.EMAIL_FROM_PASS || 'changetoyourpassword'

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: from,
            pass: to
        }
    });

    var today = new Date();
    let url = "https://" + process.env.HEROKU_APP_NAME + ".herokuapp.com";
    var htmlContent = 'Du har nu bara: ' + CountLeft + " kvar...<br/>";
    htmlContent += 'Klicka <a href="' + url + '/' + Typ + '">här</a> för att öppna kontroll-sidan<br/>';
    htmlContent += 'Eller använd snabblänkarna för att lägga till önskat antal ' + Typ + '(er):<br/>'
    htmlContent += '<a href="' + url + '/addtocount/' + Typ + '/-1" style="margin-right:15px;">-1</a><a href="' + url + '/addtocount/' + Typ + '/1" style="margin-right:15px;">+1</a>        ';
    htmlContent += '<a href="' + url + '/addtocount/' + Typ + '/5" style="margin-right:15px;">+5</a><a href="' + url + '/addtocount/' + Typ + '/10" style="margin-right:15px;">+10</a>';

    var mailOptions = {
        from: from,
        to: to,
        subject: 'Dags att beställa fler av typen: ' + Typ + '! (' + today.getDate() + "/" + today.getMonth()+1 + ")",
        //text: 'Du har nu bara: ' + CountLeft + " kvar..."
        html: htmlContent
    };

    if(process.env.LANG == "ENG"){
        htmlContent = 'You only have: ' + CountLeft + " left...<br/>";
        htmlContent += 'Click <a href="' + url + '/' + Typ + '">here</a> to launch the control-site<br/>';
        htmlContent += 'Or use one of these quick-buttons to add to the ' + Typ + '-stash:<br/>'
        htmlContent += '<a href="' + url + '/addtocount/' + Typ + '/-1" style="margin-right:15px;">-1</a><a href="' + url + '/addtocount/' + Typ + '/1" style="margin-right:15px;">+1</a>        ';
        htmlContent += '<a href="' + url + '/addtocount/' + Typ + '/5" style="margin-right:15px;">+5</a><a href="' + url + '/addtocount/' + Typ + '/10" style="margin-right:15px;">+10</a>';
        
        mailOptions = {
            from: from,
            to: to,
            subject: 'Time to order more of type: ' + Typ + '! (' + today.getDate() + "/" + today.getMonth()+1 + ")",
            html: htmlContent
        };
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = { sendEmail }