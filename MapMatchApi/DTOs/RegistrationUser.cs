namespace MapMatchApi.DTOs
{
    public class RegistrationUser
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Username { get; set; } 
        public required string Password { get; set; }
        [Compare("Password")]
        public required string ConfirmPassword { get; set; }
        [EmailAddress]
        public required string Email { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public required bool IsAdmin { get; set; }

    }
}
