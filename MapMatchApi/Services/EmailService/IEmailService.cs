namespace MapMatchApi.Services.EmailService
{
    public interface IEmailService
    {
        bool RegistrationConfirmationEmail(RegisteredUser user,string codeEncoded);
    }
}
