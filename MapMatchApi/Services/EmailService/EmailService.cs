using System;
using System.Security.Cryptography;

namespace MapMatchApi.Services.EmailService
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public bool RegistrationConfirmationEmail(RegisteredUser user, string codeEncoded)
        {

            //var confirmationLink = Url.Action("VerifyUserEmail", "user", new { codeEncoded, email = u.Email }, Request.Scheme);
            var confirmationLink = $"https://localhost:7229/api/RegisteredUser/verifymail?email={user.Email}&code={codeEncoded}";

            String poruka;
            poruka = $"Welcome {user.FirstName},\n\nPlease confirm your account registered on MapMatch with this email adress on link down below.\n" +
                confirmationLink + "\n\nWelcome to MapMatch!";
            var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_configuration.GetSection("EmailConfig:EmailUserName").Value));
        email.To.Add(MailboxAddress.Parse(user.Email));
        email.Subject = "MapMatch registration confirmation";
        email.Body = new TextPart(TextFormat.Text)
        {
                Text = poruka
        };

        using var smtp = new SmtpClient();
        smtp.Connect(_configuration.GetSection("EmailConfig:EmailHost").Value, 587, SecureSocketOptions.StartTls);
        smtp.Authenticate(_configuration.GetSection("EmailConfig:EmailUserName").Value, _configuration.GetSection("EmailConfig:EmailPassword").Value);
        smtp.Send(email);
        smtp.Disconnect(true);
                //"smtp.gmail.com"

        return true;
         }
        
    }
}
