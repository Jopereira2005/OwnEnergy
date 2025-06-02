namespace UserService.Application.DTOs;

public class LoginResponseDTO
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string AccessToken { get; set; } = null!;
}
