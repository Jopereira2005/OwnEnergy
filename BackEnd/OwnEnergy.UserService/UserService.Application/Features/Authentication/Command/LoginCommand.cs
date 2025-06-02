using MediatR;
using UserService.Application.DTOs;

namespace UserService.Application.Features.Authentication.Command;

public class LoginCommand(string username, string password) : IRequest<LoginResponseDTO>
{
    public string Username { get; set; } = username;
    public string Password { get; set; } = password;
}
