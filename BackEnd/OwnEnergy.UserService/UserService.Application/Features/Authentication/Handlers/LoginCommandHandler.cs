using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using UserService.Application.Common.Services.Auth;
using UserService.Application.DTOs;
using UserService.Application.Features.Authentication.Command;
using UserService.Domain.Interfaces;
using Entity = UserService.Domain.Entities;

namespace UserService.Application.Features.Authentication.Handlers;

public class LoginCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher<Entity.User> passwordHasher,
    IAuthService authService,
    IMapper mapper
) : IRequestHandler<LoginCommand, LoginResponseDTO>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IPasswordHasher<Entity.User> _passwordHasher = passwordHasher;
    private readonly IAuthService _authService = authService;
    private readonly IMapper _mapper = mapper;

    public async Task<LoginResponseDTO> Handle(
        LoginCommand request,
        CancellationToken cancellationToken
    )
    {
        var user =
            await _userRepository.FindByUsernameAsync(request.Username)
            ?? throw new KeyNotFoundException("Usuário não encontrado.");

        var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.Password,
            request.Password
        );
        if (passwordVerificationResult == PasswordVerificationResult.Failed)
            throw new UnauthorizedAccessException("Senha incorreta.");

        var accessToken = await _authService.LoginUserAsync(user);

        var loginResponse = _mapper.Map<LoginResponseDTO>(user);
        loginResponse.AccessToken = accessToken;

        return loginResponse;
    }
}
