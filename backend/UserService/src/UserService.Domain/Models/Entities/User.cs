using UserService.Domain.Base;
using UserService.Domain.Models.Enums;

namespace UserService.Domain.Models.Entities;

public class User(string firstName, string lastName, string email, string password) : Entity
{
    public User(
        string firstName,
        string lastName,
        string email,
        string password,
        Roles role,
        string? state,
        string? city,
        string? phoneNumber,
        string? profilePictureUrl
    )
        : this(firstName, lastName, email, password)
    {
        Role = role;
        State = state;
        City = city;
        PhoneNumber = phoneNumber;
        ProfilePictureUrl = profilePictureUrl;
    }

    public string FirstName { get; private set; } = firstName;
    public string LastName { get; private set; } = lastName;
    public string Email { get; private set; } = email;
    public string Password { get; private set; } = password;
    public Roles Role { get; private set; } = Roles.User;
    public string? State { get; private set; }
    public string? City { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string? ProfilePictureUrl { get; private set; }

    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public void UpdateEmail(string newEmail)
    {
        if (Email != newEmail)
        {
            Email = newEmail;
            MarkAsUpdated();
        }
    }

    public void UpdatePassword(string newPassword)
    {
        if (Password != newPassword)
        {
            Password = newPassword;
            MarkAsUpdated();
        }
    }

    public void UpdateName(string newFirstName, string newLastName)
    {
        bool updated = false;

        if (FirstName != newFirstName)
        {
            FirstName = newFirstName;
            updated = true;
        }

        if (LastName != newLastName)
        {
            LastName = newLastName;
            updated = true;
        }

        if (updated)
            MarkAsUpdated();
    }

    public void UpdateAddress(string? state, string? city)
    {
        if (State != state || City != city)
        {
            State = state;
            City = city;
            MarkAsUpdated();
        }
    }

    public void UpdateContactInfo(string? phoneNumber, string? profilePictureUrl = null)
    {
        bool updated = false;

        if (PhoneNumber != phoneNumber)
        {
            PhoneNumber = phoneNumber;
            updated = true;
        }

        if (profilePictureUrl != null && ProfilePictureUrl != profilePictureUrl)
        {
            ProfilePictureUrl = profilePictureUrl;
            updated = true;
        }

        if (updated)
            MarkAsUpdated();
    }

    public void UpdateRole(Roles newRole)
    {
        if (Role != newRole)
        {
            Role = newRole;
            MarkAsUpdated();
        }
    }
}
